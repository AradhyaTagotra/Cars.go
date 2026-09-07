const express =require("express");
const cors =require("cors");
require("dotenv").config();
const pool = require("./db");
const bcrypt =require("bcrypt");
const jwt =require("jsonwebtoken");
const verifyToken = require("./authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/test-db",async  (req,res) =>{
     try{
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
     }
     catch (err){
        res.status(500).json({error : err.message});
     }
});

app.get("/api/vehicles", async (req, res) => {
  try {
    const vehiclesResult = await pool.query(`
      SELECT
        vehicle.id,
        vehicle.summary,
        vehicle.description,
        make.name AS make,
        vehicle.model,
        status.name AS status,
        gearbox_type.name AS gearbox_type,
        fuel_type.name AS fuel_type,
        body_type.name AS body_type,
        vehicle.mileage,
        vehicle.price,
        vehicle.no_of_doors,
        vehicle.no_of_seats,
        vehicle.first_registration_year
      FROM vehicle
      LEFT JOIN make ON vehicle.make = make.id
      LEFT JOIN status ON vehicle.status = status.id
      LEFT JOIN gearbox_type ON vehicle.gearbox_type = gearbox_type.id
      LEFT JOIN fuel_type ON vehicle.fuel_type = fuel_type.id
      LEFT JOIN body_type ON vehicle.body_type = body_type.id
    `); 

    const imagesResult = await pool.query('SELECT * FROM vehicle_images');
    const vehiclesWithImages = vehiclesResult.rows.map(vehicle => ({
      ...vehicle, 
      images: imagesResult.rows.filter(img => img.vehicleid === vehicle.id),
    }));
    res.json(vehiclesWithImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login",  async (req,res) => {
   const {email, password} =req.body;

   try{
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if(result.rows.length === 0){
      return res.status(401).json({error :"Invalid email or password"});
    }

    const user =result.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if(!passwordMatches){
      return res.status(401).json({error: "Invaild email or password"});
    }

    const token  =jwt.sign(
      {id: user.id ,role: user.role, email: user.email},
      process.env.JWT_SECRET,
      {expiresIn : "8h"}
    );

    res.json({message: "Login successful" ,token, role: user.role, email: user.email});
   }
   catch (err){
    res.status(500).json({error: "err.message"});
   }
});

app.post("/api/admin/create-admin" ,verifyToken, async (req,res) =>{
  if(req.user.role !== "root"){
    res.status(403).json({error:"Only the root user can create admin accounts"});
  }
  const {email, password} =req.body;

  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const result  = await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1,$2,$3) RETURNING email, id , role",
      [email, hashedPassword, "admin"]
    );
    res.json({message: "Admin created successfully", user: result.rows[0]});
  }
  catch(err){
    res.status(500).json({error :"err.message"})
  }
});

app.get("/" , (req,res)=>{
    res.send("Carslist backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
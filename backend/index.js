const express =require("express");
const cors =require("cors");
require("dotenv").config();
const pool = require("./db");

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
    const result = await pool.query(`
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
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/" , (req,res)=>{
    res.send("Carslist backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
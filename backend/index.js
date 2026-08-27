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

app.get("/" , (req,res)=>{
    res.send("Carslist backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
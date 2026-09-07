const bcrypt  =require("bcrypt");
const pool = require("./db");

async function createRootUser() {
    const email = "your-email@example.com";
    const plainPassword = "choose-a-strong-password";

    const hashedPassword= await bcrypt.hash(plainPassword,10);

    await pool.query(
        "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)",
        [email, hashedPassword, "root"]
    );
    console.log("Root user created successfully");
    process.exit();
}
createRootUser();
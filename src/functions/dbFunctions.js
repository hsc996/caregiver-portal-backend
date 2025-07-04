const mongoose = require("mongoose");

async function dbConnect(){
    // Retrieve db from .env file
    const darabaseUrl = process.env.DATABASE_URL || `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`;
    await mongoose.connect(databaseUrl);
    console.log("Connected to database at" + databaseUrl);
}

module.exports = {
    dbConnect
}
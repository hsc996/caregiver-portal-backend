const mongoose = require("mongoose");

async function dbConnect(){
    // Retrieve db from .env file
    const databaseUrl = process.env.DATABASE_URL || `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`;
    await mongoose.connect(databaseUrl);
    console.log("Connected to database at" + databaseUrl);
}

async function dbDisconnect(){
    await mongoose.disconnect();
}

async function dbDrop(){
    await mongoose.db.connection.dropDatabase();
}

module.exports = {
    dbConnect,
    dbDisconnect,
    dbDrop
}
const mongoose = require("mongoose");

async function dbConnect(){
    const databaseUrl = process.env.DATABASE_URL || `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`;
    try {
        await mongoose.connect(databaseUrl);
        console.log(`Connected to database at ${databaseUrl}`);
    } catch (err) {
        throw new Error(`Database connection failed: ${err.message}`);
    }
}

async function dbDisconnect(){
    await mongoose.disconnect();
}

async function dbDrop(){
    await mongoose.connection.db.dropDatabase();
}

module.exports = {
    dbConnect,
    dbDisconnect,
    dbDrop
}
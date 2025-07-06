const { dbConnect, dbDisconnect, dbDrop } = require("./dbFunctions");

async function drop(){
    await dbDrop();
    console.log("Dropping complete, disconnecting from database.");
    await dbDisconnect();
}

dbConnect.then(() => {
    console.log("Connected to database.");
    drop();
})
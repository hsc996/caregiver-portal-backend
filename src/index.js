require("dotenv").config();

const { app } = require("./server");
const { dbConnect } = require("./db/dbFunctions")

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    await dbConnect();
    console.log("Server is running on port http://localhost:" + PORT);
});
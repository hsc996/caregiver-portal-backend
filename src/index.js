require("dotenv").config();

const { app } = require("./server");

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    console.log("Server is running on port http://localhost:" + PORT);
})
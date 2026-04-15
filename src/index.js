require("dotenv").config();

const { app } = require("./server");
const { dbConnect } = require("./db/dbFunctions")

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    await dbConnect();
    const env = process.env.NODE_ENV || 'development';
    const url = env === 'production' ? `port ${PORT}` : `http://localhost:${PORT}`;
    console.log(`Server is running on ${url} [${env}]`);
});
const express = require("express");

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));


app.get("/", (request, response) => {
    response.status(200).json({
        message: "Hello world!"
    });
});

module.exports = {
    app
}
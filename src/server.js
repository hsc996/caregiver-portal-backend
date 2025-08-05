const express = require("express");

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));


app.get("/", (request, response) => {
    response.status(200).json({
        message: "Hello world!"
    });
});

//swagger config
const { swaggerSpecs, swaggerUi } = require('./utils/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/** 
 * Routes 
*/

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

module.exports = {
    app
}
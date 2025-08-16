const express = require("express");
const app = express();
const cors = require('cors');
const { errorHandlingMiddleware } = require("./utils/middleware");

let corsOptions = {
    origin: [
        'http://localhost:8080',
        'http://localhost:5173'
    ],
    optionsSuccessStatus: 200,
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.methods === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(cors(corsOptions));
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

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

app.use(errorHandlingMiddleware);

module.exports = {
    app
}
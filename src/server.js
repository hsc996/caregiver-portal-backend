const express = require("express");
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const { errorHandlingMiddleware } = require("./utils/middleware");

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. server-to-server, native mobile)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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

const patientRoutes = require('./routes/patientRoutes');
app.use('/patient', patientRoutes);

app.use(errorHandlingMiddleware);

module.exports = {
    app
}
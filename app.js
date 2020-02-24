const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');

const app = express();
const server = require('http').createServer(app);
const db = require('./config/database');

db.connect();
const port = process.env.PORT || 9000;

const { authentication } = require('./middleware/index');

const indexRoute = require('./routes/index');
const AuthRoute = require('./routes/auth');
const UserRoute = require('./routes/users');
const DoctorRoute = require('./routes/doctors');
const PatientRoute = require('./routes/patients');

const corsOptions = {
  origin: true,
  methods: 'GET, PUT, DELTE, OPTIONS, PATCH',
  credintials: true,
  exposedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use('/', express.static(path.join(`${__dirname}/uploads`)));


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routing
app.get('/', (req, res) => res.json({ message: 'Welcome to hospital management Application' }));

app.use('/api', indexRoute);
app.use('/api/auth/', AuthRoute);
app.use('/api/v1/*', authentication.validateToken);
app.use('/api/v1/users', UserRoute);
app.use('/api/v1/users/doctor', DoctorRoute);
app.use('/api/v1/users/patient', PatientRoute);


/**
 * Unhandled promise rejection handler
 */
process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection at:', reason.stack);
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
});

/**
 * 404 not found route
 */
app.use((req, res) => res.status(404).send({ error: 'Not Found' }));


server.listen(port, () => console.log(`app listening on port: ${port}!`));

module.exports = app;

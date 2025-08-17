// server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/Users');
const Job = require('./models/Job');
const Company = require('./models/Company');

// Route
const authenticationRouter = require('./Routes/authRoutes');
const JobRouter = require('./Routes/jobRoutes');
const CompanyRouter = require('./Routes/companyRoutes');
const applicationsRoute = require('./Routes/applicationsRoutes');
const UserRoutes = require('./Routes/userRoutes');
const PasswordRouter = require('./Routes/ResetPasswordRoutes');

// DB connection
const connectionDB = require('./configer/db');

// App config
const app = express();
const PORT = process.env.PORT || 5002;
const HOSTNAME = process.env.HOSTNAME;

// Connect DB
connectionDB();

// Allowed origins for CORS
const allowedOrigins = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], // include OPTIONS
  credentials: true, // allow cookies/auth headers
  optionsSuccessStatus: 204, // standard for preflight
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve the uploads folder so files can be accessed directly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
try {
    res.json({
    success: true,
    message: 'Job portal API is running',
    time: new Date().toISOString(),
  });
} catch (error) {
  res.json({
    success : false,
    message : 'Job API error'
  })
}
});

// API Routes
app.use('/api/auth', authenticationRouter);
app.use('/job', JobRouter);
app.use('/company', CompanyRouter);
app.use('/application', applicationsRoute);
app.use('/upload', UserRoutes);
app.use('/password', PasswordRouter);

// Start server
app.listen(PORT, HOSTNAME, error => {
  if (error) {
    console.error(error);
  } else {
    console.log(` Server started: http://${HOSTNAME}:${PORT}/`);
  }
});

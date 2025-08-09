const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./models/Users');
const Job = require('./models/Job');
const Company = require('./models/Company');
const bcrypt = require('bcryptjs');
const authticationRouter = require('./Routes/authRoutes');
const JobRouter = require('./Routes/jobRoutes');
const CompanyRouter = require('./Routes/companyRoutes');
const applicationsRoute = require('./Routes/applicationsRoutes');
const UserRoutes = require('./Routes/userRoutes');

const connectionDB = require('./configer/db');
const server_config = {
  port: 5001,
  hostname: 'localhost',
};
// database connection
connectionDB();

//middleware connections
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// async function test() {
//   const newUser = new User({
//     name: 'John Doe',
//     email: 'john@example.com',
//     password: 'mypassword123',
//   });
//   await newUser.save();
//   console.log('saved user', newUser);

//   const isMatch = await bcrypt.compare('mypassword123', newUser.password);
//   console.log('Password matched:', isMatch);
// }
// test();

app.get('/', (req, res) => {
  res.send('job portal api is running');
});

// Routes
app.use('/api/auth/', authticationRouter);
app.use('/job', JobRouter);
app.use('/company', CompanyRouter);
app.use('/application', applicationsRoute);
app.use('/upload', UserRoutes);

// app.use('/api/auth', )
app.listen(server_config.port, server_config.hostname, error => {
  if (error) {
    console.log(error);
  } else {
    console.log(
      `Server started :  http://${server_config.hostname}:${server_config.port}/`
    );
  }
});

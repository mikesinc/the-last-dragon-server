const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const app = express();

//Middleware
app.use(express.json());
app.use(cors());

//Import Routes
const authenticateRoute = require('./routes/authenticate');
const authoriseRoute = require('./routes/authorise');

//Route Middlewares
app.use('/api/user', authenticateRoute);
app.use('/api/verify', authoriseRoute);

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT}.`);
});
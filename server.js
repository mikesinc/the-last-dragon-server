const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const app = express();

//Import Routes
const authRoute = require('./routes/auth');
const memberRoute = require('./routes/members');

//Middleware
app.use(express.json());
app.use(cors());
//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/membercontent', memberRoute);

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT}.`);
});
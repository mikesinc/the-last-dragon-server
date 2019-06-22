const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const register = require('./controllers/register');
const signin = require('./controllers/login');
const profile = require('./controllers/profile');

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('it is working') });
app.post('/login', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfileGet(db));

app.listen(process.env.PORT || 3001, () => {
    console.log(`app is running on port ${process.env.PORT}.`);
});
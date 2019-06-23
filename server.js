const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');

const db = knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'chloe',
      database: 'theLastDragon',
      //connectionString : process.env.DATABASE_URL,
      //ssl: true
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('it is working') });
app.post('/login', login.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfileGet(db));

app.listen(process.env.PORT || 3001, () => {
    console.log(`app is running on port ${process.env.PORT}.`);
});
const router = require('express').Router();
const register = require('./register');
const login = require('./login');
const knex = require('knex');
const bcrypt = require('bcryptjs');
// const profile = require('./profile');

//Connect to DB
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        database: 'theLastDragon',
        password: 'chloe',
    //   connectionString : process.env.DATABASE_URL,
    //   ssl: true
    }
});

router.get('/', (req, res) => res.send('Server up and running.'))
router.post('/register', register.handleRegister(db, bcrypt));
router.post('/login', login.handleSignin(db, bcrypt));

module.exports = router;
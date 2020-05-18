const router = require('express').Router();
const register = require('../controllers/register');
const login = require('../controllers/login');
const refresh = require('../controllers/refresh');
const emailController = require('../controllers/confirm');
const knex = require('knex');
const bcrypt = require('bcryptjs');

//Connect to DB
const db = knex({
    client: 'pg',
    connection: {
          connectionString : process.env.DATABASE_URL,
          ssl: true
    }
});

router.get('/wake-up', (req, res) => res.json('👌'));
router.get('/', (req, res) => res.send('Server up and running.'))
router.post('/register', register.handleRegister(db, bcrypt));
router.post('/login', login.handleSignin(db, bcrypt));
router.post('/confirmation', emailController.collectEmail(db));
router.get('/confirm/:id', emailController.confirmEmail(db));
router.post('/token', refresh.handleRefresh(db, bcrypt));
router.delete('/logout', refresh.handleDelete(db, bcrypt));

module.exports = router;
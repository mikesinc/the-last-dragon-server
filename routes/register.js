const { registerValidation } = require('../validation');
const jwt = require('jsonwebtoken');

const handleRegister = (db, bcrypt) => (req, res) => {
    //Register Form Validation
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Create new user
    const { email, password, username } = req.body;
    const hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    username: username,
                    joined: new Date()
                })
                .then(user => {
                    // res.json(user[0]);
                    const token = jwt.sign({ _id: user[0].id }, process.env.TOKEN_SECRET);
                    res.header('auth-token', token).send(token);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })      
    .catch(err => res.status(400).send(err.detail));
}

module.exports = {
    handleRegister
};
const { loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');

const handleSignin = (db, bcrypt) => (req, res) => {
    //Login Validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Login user
    const { email, password } = req.body;
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        //Create and assign a token
                        const token = jwt.sign({ 
                            id: user[0].username,
                            exp: new Date().getTime() + 60*60*1000
                        }, process.env.TOKEN_SECRET);
                        res.header('auth-token', token).send(token);
                    })
                    .catch(err => res.status(400).send("incorrect email or password"));
            } else {
                return res.status(400).send("incorrect email or password");
            }
        })
        .catch(err => res.status(400).send("incorrect email or password"));
}

module.exports = {
    handleSignin
}
const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return res.status(400).json('incorrect form submission');
    }
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
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })      
    .catch(err => {
        res.status(400).json('unable to register')
        console.log(err)
    });
}

module.exports = {
    handleRegister
};
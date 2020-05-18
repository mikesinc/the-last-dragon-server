const { generateAccessToken } = require("./login");
const jwt = require('jsonwebtoken');

const handleRefresh = (db, bcrypt) => (req, res) => {
    const refreshToken = req.body.token

    //check if refresh token was provided
    if (!refreshToken) return res.sendStatus(401)

    //check if refresh token is in DB
    let dbRefreshToken = db.select("*").from("refreshtokens").where("refreshtoken", "=", refreshToken)
    if (!dbRefreshToken) return res.sendStatus(403)

    //if in DB, send new access token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
}

const handleDelete = (db, bcrypt) => (req, res) => {
    const refreshToken = req.body.token
    
    //delete refreshtoken on user logout
    try {
      db.delete('refreshtoken').from('refreshtokens').where('refreshtoken', '=', refreshToken)
      .then(data => console.log(data))
      } catch (err) {
        console.log(err);
      }
    res.sendStatus(204)
}

module.exports = {
    handleRefresh,
    handleDelete
}
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorisation']
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(401).send('Access Denied');

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).send(err);
    }
}
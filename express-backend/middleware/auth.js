const jwt = require('jsonwebtoken')
const jwtSecret = require('../config/jwtSecret')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' })
    }
    const token = authHeader;
    try {
        jwt.verify(token, jwtSecret)
        next();
    } catch (error) {
       return res.status(401).json(error)
    }
}
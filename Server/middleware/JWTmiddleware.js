const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_KEY = process.env.JWT_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token 
    if (!token) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); 
        }
        req.user = user; 
        next(); 
    });
};

module.exports = authenticateToken;
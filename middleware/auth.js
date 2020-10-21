const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const bearer = req.cookies['login-token'];
    if(bearer && bearer.includes('Bearer ')) {
        let token = bearer.replace('Bearer ', '').trim();
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.cookie('loggedIn', false);
                return res.status(401).json(err);
            }
            req.user = {
                id: decoded.id,
                username: decoded.username
            }
            next();
        })
    } else {
        res.cookie('loggedIn', false);
        return res.status(401).json("Unauthorized");
    }
};
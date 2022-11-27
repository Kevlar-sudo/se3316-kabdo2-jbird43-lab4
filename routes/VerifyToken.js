const jwt = require('jsonwebtoken');

//Middle ware for routes that needs auth
module.exports = function (req, res, next) {

    const token = req.header('auth-token');
    if(!token) return res.status(401).send('access denied');

    try{
        const varified = jwt.verify(token, "shhhhhhh");
        req.user = varified;
        next();
    }catch(err){
        res.status(400).send("Invalid Token");
    }
}
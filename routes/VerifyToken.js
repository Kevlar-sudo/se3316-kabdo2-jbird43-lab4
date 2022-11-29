const jwt = require('jsonwebtoken');

//Middle ware for routes that needs auth
module.exports = function (req, res, next) {

    const token = req.header('Cookie');

    let [key, value] = token.split(';');
    let[key2, value2] = key.split('=');

    console.log(value2.trim());
    console.log(value.trim());
    if (!token) return res.status(401).send('access denied');

    try {
        const varified = jwt.verify(value2.trim(), "shhhhhhh");
        req.user = varified;
        next();
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
}
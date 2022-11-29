const jwt = require('jsonwebtoken');

//Middle ware for routes that needs auth
module.exports = function (req, res, next) {

    const token = req.header('Cookie');

    console.log(token)
    if (token === undefined) {
        return res.json({status: 400, message: "Invalid Token"});
    } else {
       console.log(token);
        let [auth, user] = token.split(';');
        let [key, value] = auth.split('=');

        console.log(auth.trim());
        console.log(user.trim());
        console.log(key.trim());
        console.log(value.trim());

        if (!token)  res.json({status: 401, message: 'access denied'});

        try {
            const varified = jwt.verify(value.trim(), "shhhhhhh");
            req.user = varified;
            next();
        } catch (err) {
         res.json({status: 400, message: "Invalid Token"});
        }

    }
}
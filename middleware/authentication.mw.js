const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    try {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded) {
                // console.log(decoded)
                req.body.userId = decoded.userId;
                next();
            } else {
                res.send("Invalid Token")
            }
        });
    } catch (err) {
        res.send("Token missing");
    }


}

module.exports = authentication;
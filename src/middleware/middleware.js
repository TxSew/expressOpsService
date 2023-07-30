const jwt = require("jsonwebtoken")

class Middleware {
    verifyCookies(req, res, next) {
        jwt.verify(req.token, process.env.ACCESS_TOKEN,{ ignoreExpiration: true} ,(err, decoded) => {
            if (err) {
                console.log('Token invalid');
              } else {
                console.log('Token valid');
                console.log(decoded);
                next()
              }
        } ) 
    } 
}
 module.exports = new Middleware()
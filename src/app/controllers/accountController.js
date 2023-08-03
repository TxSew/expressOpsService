const Account = require("../models/account");
const bcrypt = require("bcrypt");
const session = require("express-session");
const jwt = require("jsonwebtoken");

class AccountController {
  store(req, res, next) {
    const { firstName, lastName, Email, Number, Password } = req.body;
    console.log(firstName);
  
    // Check if the email already exists in the database
    Account.findOne({ where: { Email } })
      .then(existingAccount => {
        if (existingAccount) {
          // If the email already exists, return an error response
          return res.json("Email already exists" );
        }
  
        // If the email is unique, proceed with account creation
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            console.log(err);
            return next(err);
          }
  
          // Hash the password with the generated salt
          bcrypt.hash(Password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              return next(err);
            }
  
            // Create a new Account in the database with the hashed password and other user information
            Account.create({
              firstName,
              lastName,
              Email,
              Password: hash,
              Number,
            })
            .then(data => {
              const { Password, ...rest } = data;
              const { dataValues } = rest;
              const { user } = dataValues;
              console.log(dataValues);
              res.status(200).json({
                ...dataValues
              });
              next();
            })
            .catch(err => {
              console.log(err);
              res.status(401).json({ message: "Error creating account" });
            });
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      });
  }
  
  // check User
  async checkUser(req, res, next) {
    try {
      const { Email, Password } = req.body;
      const user = await Account.findOne({ where: { Email: Email } });
      const { dataValues } = await user;
      if (dataValues === null) {
     return    res.status(404).json("wrong Email");
      }
       else {
         
         const validPassword = await bcrypt.compareSync(
           Password,
           dataValues.Password
         );
         console.log(validPassword);
         if (!validPassword) {
           res.status(200).json({
             message: "Password is not define",
           });
         }
         if (dataValues.role =='1' && validPassword) {
           const token = jwt.sign(
             {
               id: dataValues.id,
               fistName: dataValues.fistName,
               Email: dataValues.Email,
             },
             "ACCESS_TOKEN",
             {
               expiresIn: "1d",
             }
           );
           // req.session.role = dataValues.role
           const { Password, ...rest } = dataValues;
           res.status(200).json({
             message: "login success",
             user: rest,
             token: token,
             // session: req.session.role
           });
         }
          else if(dataValues.role =='0' && validPassword) {
            const token = jwt.sign(
             {
               id: dataValues.id,
               role: dataValues.role,
               fistName: dataValues.fistName,
               Email: dataValues.Email,
             },
             "ACCESS_TOKEN",
             {
               expiresIn: "1d",
             }
           );
           // req.session.role = dataValues.role
           const { Password, ...rest } = dataValues;
           res.status(200).json({
             message: "login success",
             user: rest,
             token: token,
             // session: req.session.role
           });
          }
       }
    } catch (err) {
      res.json({
        message: "error",
      });
    }
  }
  //verify access
  verifyCookies(req, res, next) {
    jwt.verify(
      req.token,
      process.env.ACCESS_TOKEN,
      { ignoreExpiration: true },
      (err, decoded) => {
        if (err) {
          res.json("error", err);
        } else {
          console.log("Token valid");
          res.status(200).json("success");
          console.log(decoded);
          next();
        }
      }
    );
  }
}

module.exports = new AccountController();

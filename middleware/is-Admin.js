const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.send({status: 401, error: "true", message: "Not authenticated" });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);
  } catch (error) {
    return res.send({status: 422, error: "true", message: "Invalid authorization header" });
  }
  if (!decodedToken) {
    return res.send({status: 401, error: "true", message: "Not authenticated" });
  }

  try {
    User.findById({ _id: decodedToken.userId }, function (err, user) {
      if (err) {
        return res.status(401).send({ error: "true", message: "Unauthorized access" });
      }      
      if(user.role !== 'admin'){
        return res.status(401).send({ error: "true", message: "Unauthorized access" });          
      }
    });
  } catch (error) {
    return res.status(500).send({ error: "true", message: "Unauthorized access" });
  }

  req.userId = decodedToken.userId;
  req.userEmail = decodedToken.email;
  next();
};

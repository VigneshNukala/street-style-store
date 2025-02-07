const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/server');

const authenticateToken = (req, res, next) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];
  
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  
  if (jwtToken === undefined) {
    return res.status(401).send("Invalid JWT Token");
  }

  jwt.verify(jwtToken, SECRET_KEY, async (error, payload) => {
    if (error) {
      return res.status(401).send("Invalid JWT Token");
    }
    req.username = payload.username;
    next();
  });
};

module.exports = { authenticateToken };
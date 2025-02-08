const jwt = require("jsonwebtoken");
require("dotenv").config();

const { handleError } = require("../utils");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    let jwtToken;
    // const token = req.cookies.token;
    // console.log(token);

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }



    if (!jwtToken) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid JWT Token" });
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("Secret key is missing from environment variables");
    }
    jwt.verify(jwtToken, secretKey, (error, payload) => {
      if (error) {
        return res.status(401).json({ status: "error", message: error });
      }
      req.username = payload.username;
      next();
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { authenticateToken };

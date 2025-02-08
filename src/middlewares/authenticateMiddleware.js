const jwt = require("jsonwebtoken");
require("dotenv").config();

const { handleError } = require("../utils");

const authenticateToken = (req, res, next) => {
  try {
    const jwtToken = req.cookies?.authToken;

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

// exports.isLogin = async (req, res, next) => {
//   const token = req.cookies?.authToken;
//   if (!token) {
//     return res.status(401).send("Authorization token not provided");
//   }
//   await jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(401).send("Invalid token");
//     }
//     req.userData = { user_id: decoded.user_id, sub_id: decoded.sub_id };
//     next();
//   });
// };

// res.cookie("authToken", token, {
//   httpOnly: true,
//   secure: true,
//   sameSite: "None",
//   maxAge: cookieExpiry,
//   path: "/",
// });

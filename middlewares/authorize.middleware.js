const jwt = require("jsonwebtoken");

const authorizeMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    jwt.verify(token, "NEMB25", function (err, decoded) {
      if (err) {
        res.status(400).send({ message: err.message });
      } else {
        req.body.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

module.exports = authorizeMiddleware;

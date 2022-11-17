const jwt = require('jsonwebtoken');
const JWT_SECRET="process.env.jwt";

const validateToken = (req, res, next) => {
  console.log("vaidatetoken")
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "User not logged in!" });

  try {
    const validToken = jwt.verify(accessToken, JWT_SECRET);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
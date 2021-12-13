const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error("nema korisnika");
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send(e.message);
  }
};
module.exports = auth;

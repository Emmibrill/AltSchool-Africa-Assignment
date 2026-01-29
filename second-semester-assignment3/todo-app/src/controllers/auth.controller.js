const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const logger = require("../utils/logger");

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashedPassword });

    logger.info(`User registered: ${username}`);
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.redirect("/login");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect("/login");

    req.session.userId = user._id;
    logger.info(`User logged in: ${username}`);
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

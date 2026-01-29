const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const logger = require("../utils/logger");

exports.getRegister = (req, res) => {
  try {
    res.render("register", { error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};


exports.getLogin = (req, res) => {
  try {
    res.render("login", { error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
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

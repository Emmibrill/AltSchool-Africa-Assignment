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

     //validation
    if (!username || !password) {
      return res.render("register", {
        error: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.render("register", {
        error: "Password must be at least 6 characters",
      });
    }

    //Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", {
        error: "Account already exists. Please login.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashedPassword });

    logger.info(`User registered: ${username}`);
    res.redirect("/login");
  } catch (error) {
    res.render("register", {
      error: "Something went wrong. Try again.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Empty fields check
    if (!username || !password) {
      return res.render("login", {
        error: "Username and password are required",
      });
    }

    //Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", {
        error: "Invalid username or password",
      });
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Invalid username or password",
      });
    }

    //Success
    req.session.userId = user._id;
    logger.info(`User logged in: ${username}`);
    res.redirect("/todos");
  } catch (error) {
    res.render("login", {
      error: "Login failed. Try again.",
    });
  }
};


exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

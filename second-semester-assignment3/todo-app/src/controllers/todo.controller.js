const Todo = require("../models/todo.model");
const logger = require("../utils/logger");

exports.getTodos = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = { user: req.session.userId };

    if (status) filter.status = status;

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.render("dashboard", { todos, error: null, message: null });
  } catch (error) {
    res.render("dashboard", { 
      todos: [], 
      error: "Failed to load todos. Try again." 
    });
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    await Todo.create({
      title: req.body.title,
      user: req.session.userId
    });

    logger.info("Todo created");
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { status: req.body.status }
    );

    res.redirect("/todos");
  } catch (error) {
    next(error);
    res.render("dashboard", { 
      todos: [], 
      message: null,
      error: "Failed to update todo status. Try again." 
    });
  }
};
exports.deleteTodo = async (req, res, next) => {
  try {
    await Todo.findOneAndDelete(
      { _id: req.params.id, user: req.session.userId },
    );
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
};
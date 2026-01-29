const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const todoController = require("../controllers/todo.controller");

router.get("/todos", auth, todoController.getTodos);
router.post("/todos", auth, todoController.createTodo);
router.post("/todos/:id/status", auth, todoController.updateStatus);

module.exports = router;
router.post("/todos/:id/delete", auth, todoController.deleteTodo);

module.exports = router;
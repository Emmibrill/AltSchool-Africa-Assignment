const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const todoController = require("../controllers/todo.controller");

router.get("/", auth, todoController.getTodos);
router.post("/", auth, todoController.createTodo);
router.post("/:id/status", auth, todoController.updateStatus);

module.exports = router;
router.post("/:id/delete", auth, todoController.deleteTodo);

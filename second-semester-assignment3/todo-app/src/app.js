const express = require("express");
require("dotenv").config();
const path = require("path");

const { connectToMongoDB } = require("./config/db");

const session = require("express-session");
const MongoStore = require("connect-mongo");


const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT


// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONECTION_STRING})
  })
);

// Routes
app.use("/", authRoutes);
app.use("/todos", todoRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server after connecting to the database
const startServer = async () => {
  await connectToMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;

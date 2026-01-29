require("dotenv").config();
const express = require("express");
const path = require("path");

const { connectToMongoDB } = require("./config/db");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;


const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV
const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;


// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Redirect root to login page
app.get("/", (req, res) => {
  res.redirect("/login"); // redirect root to login page
});


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session management
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONNECTION_STRING}),
    cookie: {
      secure: NODE_ENV === "production",
      httpOnly: true,
    },
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

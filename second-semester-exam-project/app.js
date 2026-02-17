require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

const app = express();

//define PORT
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//console.log("Views directory set to:", path.join(__dirname, "views"));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));


// API home page route
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Welcome to emmibrill Blogging Platform API" });
// });

// API home route with API documentation/landing page
app.get("/", (req, res) => {
  try {
    res.render("index", {
     title: "Blogging API-AltSchool Backend[Nodejs] Second Semester Exam" 
    });
    res.status(200);
    return;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
});

// Global error handler
app.use(errorHandler);

// Only start server if file is run directly
if (require.main === module) {
  const startServer = async () => {
    try {
      await connectToMongoDB();

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;

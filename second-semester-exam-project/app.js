require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

//define PORT
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));

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

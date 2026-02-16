const mongoose = require("mongoose");

const schema = mongoose.Schema;

const todoSchema = new schema(
  {
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "deleted"],
      default: "pending",
      index: true
    },
    user: {
      type: schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);

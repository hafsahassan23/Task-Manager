import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
    },

    status: {
      type: Number, // 0 = not started, 1 = in progress, 2 = completed
      default: 0,
    },

    priority: {
      type: Number, // 0 = low, 1 = medium, 2 = high
      default: 1,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },  

    user_id: { type: Schema.Types.ObjectId }
  },
  {
    timestamps: true,
  }
);

// Create Task model
const Task = mongoose.model("Task", taskSchema);

export default Task;
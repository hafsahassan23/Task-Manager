import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    const task = new Task({
      title,
      description,
      status,
      priority,
      user_id: req.user.userId,
    });

    await task.save();

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    // Find tasks that belong to the current logged-in user
    const tasks = await Task.find({
      user_id: req.user.userId,
    });

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting tasks",
      error: error.message,
    });
  }
};


// Get one task by ID
export const getOneTask = async (req, res) => {
  try {
    // Get task ID from the URL
    const taskId = req.params.id;

    const task = await Task.findOne({
      _id: taskId,
      user_id: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task retrieved successfully",
      task,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error getting task",
      error: error.message,
    });
  }
};

// Update one task
export const updateTask = async (req, res) => {
  try {
    // Get task ID from URL
    const taskId = req.params.id;

    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        user_id: req.user.userId,
      },

      // Update fields sent from the client
      {
        $set: req.body,
      },

      // Return the updated document
      {
        new: true,
        runValidators: true,
      }
    );

    // If task was not found
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Send updated task
    res.status(200).json({
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};

// Delete one task
export const deleteTask = async (req, res) => {
  try {
    // Get task ID from URL
    const taskId = req.params.id;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user_id: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
};
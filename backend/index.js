console.log("Node.js project is running111");
console.log("Task Management Server is running");
console.log("Task Management Server is running1111");
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import taskRoutes from "./routes/taskRoute.js";
// load environment variables from .env file
dotenv.config();

// Create an Express application.
// We will use "app" to configure middleware, routes, and start the server.
const app = express();

// Enable CORS for the application.
// This allows requests from applications such as our React frontend.
app.use(cors());


// Tell Express to understand JSON data sent by the client.
//
// Example request body:
// {
//   "name": "Ali",
//   "email": "ali@example.com"
// }

app.use(express.json());


// Connect our Node.js application to MongoDB.
//
// process.env.MONGO_URI reads the MongoDB connection string
// from the .env file.

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
})

// Create our first API route.
//
// app.get() means this route accepts a GET request.
//
// "/" means the root URL.
//
// Example:
// GET http://localhost:5000/

  // req means Request.
  // It contains information sent by the client.

  // res means Response.
  // We use it to send information back to the client.

  // Send a JSON response.


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
// Read the PORT value from the .env file.
//
// If PORT is not available,
// use 5000 as the default port.
const port = process.env.PORT || 5000;
// Start the Express server.
//
// app.listen() tells the server to listen
// for incoming HTTP requests on the selected port.

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})


//node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
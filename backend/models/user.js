import mongoose from "mongoose";

// Define the schema for the User model.
const userSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    username: {
        type: String, 
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true 
    }

})

// Create the User model based on the schema.
const User  = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application.
export default User;
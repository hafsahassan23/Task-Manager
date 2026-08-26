import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Signup controller
export const signup = async (req, res) => {
  try {
    // Get data from request body
    const { name, email, password , username } = req.body;
    const existing_user = await User.findOne({ email });

    if (existing_user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
      // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
    });

    // Send response
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};



// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
    {
        userId: user._id,
        email: user.email,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h", // Token expires in 1 hour
    }
    );
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message,
    });
  }
};
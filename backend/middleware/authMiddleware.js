import jwt from "jsonwebtoken";

// Middleware to protect private routes
export const authMiddleware = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Header normally looks like:
    // Authorization: Bearer eyJhbGciOi...
    const token = authHeader.split(" ")[1];

    // Verify token using the secret (with fallback)
    const jwtSecret =
      process.env.JWT_SECRET || "default_task_manager_secret_jwt_key_2026";
    const decoded = jwt.verify(token, jwtSecret);

    // Save decoded user information in the request
    req.user = decoded;

    // Continue to the next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
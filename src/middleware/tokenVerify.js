import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const VerifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: `Unauthorized: No token provided`,
      });
    }

    // Verify JWT token
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        // If the token is invalid or expired
        return res.status(401).json({
          status: false,
          message: `Unauthorized: Invalid token`,
        });
      }

      // 'decoded' contains the data from the token's payload (e.g., user ID, role)
      req.user = decoded;

      // Check user role
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({
          status: false,
          message: `Forbidden: You do not have access`,
        });
      }

      next();
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [Token_VERIFY]`,
      data: error.message,
    });
  }
};

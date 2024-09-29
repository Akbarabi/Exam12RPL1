import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: `Unauthorized: No token provided`,
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          status: false,
          message: `Unauthorized: Invalid token`,
        });
      }

      const { role } = decoded;
      if (!roles.includes(role)) {
        return res.status(403).json({
          status: false,
          message: `Access Denied: You do not have permission to perform this action.`,
        });
      }

      req.user = decoded;
      next();
    });
  };
};

// export const kasirTokenVerify = async (req, res, next) => {
//   tokenVerify(req, res, next, "KASIR");
// };

// export const adminTokenVerify = async (req, res, next) => {
//   tokenVerify(req, res, next, "ADMIN");
// };

// export const managerTokenVerify = async (req, res, next) => {
//   tokenVerify(req, res, next, "MANAGER");
// };
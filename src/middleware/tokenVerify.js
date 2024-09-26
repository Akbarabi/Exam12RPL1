import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tokenVerify = async (req, res, next, role) => {
  try {
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

      req.user = decoded;

      if (req.user.role !== role) {
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

export const kasirTokenVerify = async (req, res, next) => {
  tokenVerify(req, res, next, "KASIR");
};

export const adminTokenVerify = async (req, res, next) => {
  tokenVerify(req, res, next, "ADMIN");
};

export const managerTokenVerify = async (req, res, next) => {
  tokenVerify(req, res, next, "MANAGER");
};
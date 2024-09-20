import { PrismaClient, Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const saltRounds = 10;

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: role.toUpperCase() || "ADMIN",
      },
    });

    return res.status(200).json({
      status: true,
      message: `Success create an user`,
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [User_POST]`,
      data: error,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const findUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      return res.status(400).json({
        status: false,
        message: `User not found`,
      });
    }

    // Compare password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: `Invalid password`,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: findUser.id,
        role: findUser.role,
      },
      process.env.SECRET_KEY
    );

    // Return success response
    return res.status(200).json({
      status: true,
      message: `Login successful`,
      data: { user: findUser, token: token },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: `Error on : [User_POST]`,
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    if (!users) {
      return res.status(400).json({
        status: false,
        message: `User not found`,
        data: users,
      });
    }

    return res.status(200).json({
      status: true,
      message: `Success get user`,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [User_GET]`,
      data: error,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const findUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        status: false,
        message: `User not found`,
      });
    }

    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      status: true,
      message: `Success delete user`,
      data: deleteUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [User_DELETE]`,
      data: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password, role } = req.body;

    // Find the user by ID
    const findUser = await prisma.user.findUnique({
      where: {
        id: id,
      }
    });

    // If user not found, return error
    if (!findUser) {
      return res.status(400).json({
        status: false,
        message: `Id not found`,
      });
    }

    // Hash password only if it's provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Update the user with the new data (only provided fields)
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name || findUser.name,
        email: email || findUser.email,
        password: hashedPassword || findUser.password, // Use the hashed password if provided
        role: role ? role.toUpperCase() : findUser.role, // Ensure role is uppercase
      },
    });

    return res.status(200).json({
      status: true,
      message: `Success update user`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error on : [User_UPDATE]`,
      data: error.message,
    });
  }
};

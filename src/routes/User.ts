import express, { Response, Request } from "express";
import _ from "lodash";
import Joi from "joi";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../startup/prisma";
import { fileLogger, logger } from "../startup/logging";
import dotenv from "dotenv";
import { Prisma } from "@prisma/client";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string; // Type assertion to ensure it's a string

interface Payload {
  id: number;
  is_initailizer: boolean;
  role_id: number;
}

// Function to sign JWT with payload and expiration of 24 hours
const signJwt = (payload: Payload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello" });
});

// CREATE A NEW USER
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const body = _.pick(req.body, ["name", "password", "role_id"]);
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    role_id: Joi.number().required().min(1).max(3),
  });
  try {
    const value = await schema.validateAsync(body, { abortEarly: false }); // Validate data

    value.password = await hash(value.password, 10);
    const user = await prisma.user.create({
      data: value,
    });

    const { password: _password, ...userWithoutPassword } = user;

    const payload = {
      is_initailizer: userWithoutPassword.is_initailizer,
      role_id: userWithoutPassword.role_id,
      id: user.id,
    };
    const token: string = signJwt(payload);

    res.json({
      success: true,
      message: "login was successful",
      token,

      data: {
        ...payload,
        name: userWithoutPassword.name,
      },
    });
  } catch (err) {
    if (err instanceof Joi.ValidationError) {
      const errorDetails = err.details.map((detail) => {
        logger.error(detail.message);
        return {
          message: detail.message,
          path: detail.path,
        };
      });

      res.status(400).json({
        success: false,
        errors: errorDetails,
      });

      return;
    }

    // Handle Prisma-specific errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      fileLogger.error(`Prisma error: ${err.message}`);
      if (err.code === "P2002") {
        // Example: Unique constraint violation
        res.status(400).json({
          success: false,
          message: "A user with this name already exists.",
        });
        return;
      }
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      fileLogger.error(`Validation error: ${err.message}`);
      res.status(400).json({
        success: false,
        message: "Validation error in Prisma query.",
      });
      return;
    }

    // Generic error handling
    if (err instanceof Error) {
      logger.error(err.message);
      res.status(500).json({ success: false, message: err.message });
      return;
    }

    logger.error("Internal Server Error");
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// LOGIN THE USER.
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const body = _.pick(req.body, ["name", "password", "role_id"]);
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  try {
    const { name, password } = await schema.validateAsync(body, {
      abortEarly: false,
    }); // Validate data

    const user = await prisma.user.findFirst({
      where: {
        name: name,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    const { password: _password, ...userWithoutPassword } = user;

    const payload = {
      is_initailizer: userWithoutPassword.is_initailizer,
      role_id: userWithoutPassword.role_id,
      id: user.id,
    };
    const token: string = signJwt(payload);

    res.cookie("authToken", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure flag in production
      sameSite: "strict", // Prevents CSRF attacks
    });

    res.json({
      success: true,
      message: "login was successful",

      data: {
        is_initailizer: payload.is_initailizer,
        name: user.name,
      },
    });
  } catch (err) {
    if (err instanceof Joi.ValidationError) {
      const errorDetails = err.details.map((detail) => {
        logger.error(detail.message);
        return {
          message: detail.message,
          path: detail.path,
        };
      });

      res.status(400).json({
        success: false,
        errors: errorDetails,
      });

      return;
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
      logger.error(`Validation error: ${err.message}`);
      res.status(400).json({
        success: false,
        message: "Validation error in Prisma query.",
      });
      return;
    }

    // Generic error handling
    if (err instanceof Error) {
      logger.error(err.message);
      res.status(500).json({ success: false, message: err.message });
      return;
    }

    logger.error("Internal Server Error");
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;

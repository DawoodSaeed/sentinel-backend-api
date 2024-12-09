import express, { Response, Request } from "express";
import _ from "lodash";
import Joi from "joi";
import prisma from "../startup/prisma";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello" });
});
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const body = _.pick(req.body, ["name", "password", "role_id"]);
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    role_id: Joi.number().required().min(1).max(3),
  });
  try {
    const value = await schema.validateAsync(body, { abortEarly: false }); // Validate data

    const User = await prisma.user.create({
      data: value,
    });
    
    const { password: _password, ...userWithoutPassword } = User;
    res.json({ success: true, data: userWithoutPassword });
  } catch (err) {
    if (err instanceof Joi.ValidationError) {
      const errorDetails = err.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }));

      res.status(400).json({
        success: false,
        errors: errorDetails,
      });
      return;
    }

    console.error("Unexpected error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;

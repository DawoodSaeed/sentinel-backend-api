import express, { Response, Request } from "express";
import _ from "lodash";
import Joi from "joi";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello" });
});

router.post("/register", (req: Request, res: Response) => {
  const body = _.pick(req.body, ["username", "password", "role"]);
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    role: Joi.string().required(),
  });
});

export default router;

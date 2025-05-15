import { Router, Request, Response, NextFunction } from "express";
import { User } from "../../models/user.models";
const router = Router();
import jwt from "jsonwebtoken";

router.post(
  "/api/user/auth/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { lastName, firstName, email, password } = req.body;

    if (!lastName || !firstName || !email || !password) {
      let error = new Error("Please fill in all the inputs") as CustomError;
      error.status = 400;
      return next(error);
    }

    const user = await User.findOne({ email });
    if (user) {
      let error = new Error("User already exists") as CustomError;
      error.status = 400;
      return next(error);
    }

    const newUser = User.build({ firstName, lastName, email, password });

    await newUser.save();

    req.session = {
      jwt: jwt.sign(
        { email, id: newUser._id, role: "user" },
        process.env.JWT_KEY!
      ),
    };

    res.status(201).send(newUser);
  }
);

export { router as userSignupRouter };

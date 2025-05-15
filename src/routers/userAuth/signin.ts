import { Router, Request, Response, NextFunction } from "express";
import { User } from "../../models/user.models";
import { authenticationService } from "../../../common/src/services/authentication";
import jwt from "jsonwebtoken";
const router = Router();

router.post(
  "/api/auth/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    const isEqual = authenticationService.comparePwd(user?.password, password);
    if (!isEqual) {
      const error = new Error("Invalid credntials") as CustomError;
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign(
      { email, userId: user._id, role: "user" },
      process.env.JWT_KEY!
    );
    req.session = { jwt: token };
    res.status(200).send(user);
  }
);

export { router as signinRouter };

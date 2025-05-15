import { Request, Response, NextFunction, Router } from "express";
import jwt from "jsonwebtoken";
import { Administrator } from "../../models/administrator.models";
import { authenticationService } from "../../../common/src/services/authentication";

const router = Router();

router.post(
  "/api/administrator/auth/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      let error = new Error("Please fill in all the inputs") as CustomError;
      error.status = 400;
      return next(error);
    }

    const administrator = await Administrator.findOne({ email });
    if (!administrator) {
      let error = new Error("Administrator not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    const isEqual = authenticationService.comparePwd(
      administrator?.password,
      password
    );

    if (!isEqual) {
      let error = new Error("Invalid credentials") as CustomError;
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign(
      { email, id: administrator._id, role: "administrator" },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: token,
    };

    res.status(200).send(administrator);
  }
);

export { router as administratorSigninRouter };

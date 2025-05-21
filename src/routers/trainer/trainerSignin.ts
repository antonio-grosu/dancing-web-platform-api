import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Trainer } from "../../models/trainer.models";
import { authenticationService } from "../../../common/src/services/authentication";
const router = Router();

router.post(
  "/api/trainer/auth/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      let error = new Error("Email and password are required") as CustomError;
      error.status = 400;
      return next(error);
    }

    const trainer = await Trainer.findOne({ email });

    if (!trainer) {
      let error = new Error("Trainer not found") as CustomError;
      error.status = 404;
      return next(error);
    }

    const isEqual = authenticationService.comparePwd(
      trainer?.password,
      password
    );
    if (!isEqual) {
      let error = new Error("Invalid credentials") as CustomError;
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign(
      { email, id: trainer._id, role: "trainer" },
      process.env.JWT_KEY!
    );

    req.session = { jwt: token };

    res.status(200).send(trainer);
  }
);

export { router as trainerSigninRouter };

import { Request, Response, NextFunction, Router } from "express";
import { Administrator } from "../../models/administrator.models";
import jwt from "jsonwebtoken";
const router = Router();

router.post(
  "/api/administrator/auth/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      let error = new Error("Please fill in all the inputs") as CustomError;
      error.status = 400;
      return next(error);
    }

    const administrator = await Administrator.findOne({ email });

    if (administrator) {
      let error = new Error("Administrator already exists") as CustomError;
      error.status = 400;
      return next(error);
    }

    const newAdministrator = await Administrator.build({
      firstName,
      lastName,
      email,
      password,
    });

    await newAdministrator.save();

    req.session = {
      jwt: jwt.sign(
        { email, id: newAdministrator._id, role: "administrator" },
        process.env.JWT_KEY!
      ),
    };
    res.status(201).send(newAdministrator);
  }
);

export { router as administratorSignupRouter };

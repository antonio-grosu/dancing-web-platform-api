import { Request, Response, Router, NextFunction } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { User } from "../../models/user.models";
const router = Router();

router.get(
  "/api/user/enrollment/getall",
  requireRole(["user"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;
    const user = await User.findById(userId).populate("enrolledTo");
    if (!user) {
      let error = new Error("User not found") as CustomError;
      error.status = 404;
      return next(error);
    }
    const enrolledTo = user.enrolledTo;
    res.status(200).json(enrolledTo);
  }
);

export { router as getAllEnrollmentsRouter };

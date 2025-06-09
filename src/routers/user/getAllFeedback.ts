import { Request, Response, NextFunction, Router } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
import { Feedback } from "../../models/feedback.models";
const router = Router();

router.get(
  "/api/feedback",
  requireRole(["user"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser!.id;

    const feedbacks = await Feedback.find({ belongsToUser: userId });

    res.status(200).json({ feedbacks });
  }
);

export { router as getAllFeedbackRouter };

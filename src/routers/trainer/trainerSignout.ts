import { Response, Request, NextFunction, Router } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
const router = Router();

router.post(
  "/api/trainers/auth/signout",
  requireRole(["trainer"]),
  (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    res.send({});
  }
);

export { router as trainerSignoutRouter };

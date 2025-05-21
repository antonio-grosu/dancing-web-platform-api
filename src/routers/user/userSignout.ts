import { Request, Response, NextFunction, Router } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
const router = Router();

router.post(
  "/api/user/auth/signout",
  requireRole(["user"]),
  async (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    res.send({});
  }
);

export { router as userSignoutRouter };

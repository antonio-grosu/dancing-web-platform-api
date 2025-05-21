import { Request, Response, NextFunction, Router } from "express";
import { requireRole } from "../../../common/src/middlewares/require-role";
const router = Router();

router.post(
  "/api/administrator/auth/signout",
  requireRole(["administrator"]),

  async (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    res.send({});
  }
);

export { router as administratorSignoutRouter };

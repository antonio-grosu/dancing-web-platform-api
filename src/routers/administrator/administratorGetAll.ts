import { Request, Response, NextFunction, Router } from "express";
import { Administrator } from "../../models/administrator.models";

const router = Router();

router.get(
  "/api/administrator/getAll",
  async (req: Request, res: Response, next: NextFunction) => {
    const allAdmins = await Administrator.find({});

    res.status(200).send(allAdmins);
  }
);

export { router as getAllAdministratorsRouter };

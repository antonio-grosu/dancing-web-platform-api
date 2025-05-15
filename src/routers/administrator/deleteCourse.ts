import { Request, Response, NextFunction, Router } from "express";
import { Course } from "../../models/course.models";

const router = Router();

router.delete(
  "/api/administrator/deletecourse/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      let error = new Error(
        "Id is required in order to delete a course / event"
      ) as CustomError;

      error.status = 400;
      return next(error);
    }

    const course = await Course.findById(id);

    if (!course) {
      let error = new Error("Course / event not found") as CustomError;

      error.status = 404;
      return next(error);
    }

    await Course.deleteOne({ _id: id });

    res.status(200).send({ deleted: course });
  }
);

export { router as deleteCourseRouter };

import express, { Router, RequestHandler } from "express";
import * as commentController from "../controllers/commentController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.get("/topics/:id/comments", commentController.getCommentsByTopicId as unknown as RequestHandler);
router.post(
  "/topics/:id/comments",
  authMiddleware,
  commentController.createComment as unknown as RequestHandler
);

export default router;

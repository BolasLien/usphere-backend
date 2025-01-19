import express, { Request, Response } from "express";
import commentController from "../controllers/commentController";

const router = express.Router();

router.get("/topics/:id/comments", (req: Request, res: Response) => commentController.getCommentsByTopicId(req, res));
router.post("/topics/:id/comments", (req: Request, res: Response) => commentController.createComment(req, res));
router.post("/topics/:id/comments/:commentId/like", (req: Request, res: Response) => commentController.likeComment(req, res));

export default router;

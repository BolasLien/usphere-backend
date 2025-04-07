import express, { Router, RequestHandler } from "express";
import * as likeController from "../controllers/likeController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/likes", authMiddleware, likeController.toggleLike as unknown as RequestHandler);

export default router;

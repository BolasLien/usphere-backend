import express, { Router, RequestHandler } from "express";
import * as topicController from "../controllers/topicController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.get("/", topicController.getAllTopics as unknown as RequestHandler);
router.get("/:id", topicController.getTopicById as unknown as RequestHandler);
router.post("/", authMiddleware, topicController.createTopic as unknown as RequestHandler);
router.patch("/:id", authMiddleware, topicController.updateTopic as unknown as RequestHandler);
router.delete("/:id", authMiddleware, topicController.deleteTopic as unknown as RequestHandler);
router.post("/:id/restore", authMiddleware, topicController.restoreTopic as unknown as RequestHandler);

export default router;

const express = require("express");
const topicController = require("../controllers/topicController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", topicController.getAllTopics);
router.get("/:id", topicController.getTopicById);
router.post("/", authMiddleware, topicController.createTopic);
router.patch("/:id", authMiddleware, topicController.updateTopic);
router.delete("/:id", authMiddleware, topicController.deleteTopic);
router.post("/:id/restore", authMiddleware, topicController.restoreTopic);

module.exports = router;

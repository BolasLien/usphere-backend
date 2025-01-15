const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.get("/topics/:id/comments", commentController.getCommentsByTopicId);
router.post("/topics/:id/comments", commentController.createComment);
router.post("/topics/:id/comments/:commentId/like", commentController.likeComment);

module.exports = router;

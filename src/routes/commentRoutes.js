const express = require("express");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/topics/:id/comments", commentController.getCommentsByTopicId);
router.post(
  "/topics/:id/comments",
  authMiddleware,
  commentController.createComment
);

module.exports = router;

const express = require("express");
const likeController = require("../controllers/likeController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/likes", authMiddleware, likeController.toggleLike);

module.exports = router;

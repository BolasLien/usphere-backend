const express = require("express");
const likeController = require("../controllers/likeController");
const router = express.Router();

router.post("/likes", likeController.toggleLike);

module.exports = router;

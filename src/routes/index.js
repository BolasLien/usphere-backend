const express = require("express");
const userRoutes = require("./userRoutes");
const topicRoutes = require("./topicRoutes");
const commentRoutes = require("./commentRoutes");
const likeRoutes = require("./likeRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/topics", topicRoutes);
router.use(commentRoutes);
router.use(likeRoutes);

module.exports = router;

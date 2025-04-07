import express, { Router } from "express";
import userRoutes from "./userRoutes";
import topicRoutes from "./topicRoutes";
import commentRoutes from "./commentRoutes";
import likeRoutes from "./likeRoutes";
import authRoutes from "./authRoutes";

const router: Router = express.Router();

router.use("/users", userRoutes);
router.use("/topics", topicRoutes);
router.use(commentRoutes);
router.use(likeRoutes);
router.use('/auth', authRoutes);

export default router;

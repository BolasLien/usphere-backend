import express from 'express';
import userRoutes from "./userRoutes";
import topicRoutes from "./topicRoutes";
import commentRoutes from "./commentRoutes";

const router = express.Router();

router.use('/users', userRoutes);
router.use('/topics', topicRoutes);
router.use(commentRoutes);

export default router;

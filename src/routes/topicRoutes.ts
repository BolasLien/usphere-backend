import express from 'express';
import * as topicController from '../controllers/topicController';
const router = express.Router();

router.get('/', topicController.getAllTopics);
router.get('/:id', topicController.getTopicById);
router.post('/', topicController.createTopic);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);
router.post('/:id/restore', topicController.restoreTopic);

export default router;

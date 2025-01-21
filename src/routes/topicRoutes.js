const express = require('express');
const topicController = require('../controllers/topicController');
const router = express.Router();

router.get('/', topicController.getAllTopics);
router.get('/:id', topicController.getTopicById);
router.post('/', topicController.createTopic);
router.patch('/:id', topicController.updateTopic); // 將 PUT 改為 PATCH
router.delete('/:id', topicController.deleteTopic);
router.post('/:id/restore', topicController.restoreTopic);

module.exports = router;

const express = require('express');
const topicController = require('../controllers/topicController');
const router = express.Router();

router.get('/', topicController.getAllTopics);
router.get('/:id', topicController.getTopicById);
router.post('/', topicController.createTopic);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);
router.post('/:id/restore', topicController.restoreTopic);

module.exports = router;

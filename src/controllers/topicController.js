const topicService = require("../services/topicService");

// 獲取所有話題
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await topicService.getAllTopics(req.query);
    res.json({ status: "success", data: topics });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 獲取單個話題
exports.getTopicById = async (req, res) => {
  try {
    const topic = await topicService.getTopicById(req.params.id);
    if (!topic) {
      return res
        .status(404)
        .json({ status: "error", message: "Topic not found" });
    }
    res.json({ status: "success", data: topic });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 創建新話題
exports.createTopic = async (req, res) => {
  try {
    const newTopic = await topicService.createTopic(req.body);
    res.status(201).json({ status: "success", data: newTopic });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 更新話題
exports.updateTopic = async (req, res) => {
  try {
    const updatedTopic = await topicService.updateTopic(
      req.params.id,
      req.body
    );

    if (!updatedTopic) {
      return res
        .status(404)
        .json({ status: "error", message: "Topic not found" });
    }
    res.json({ status: "success", data: updatedTopic });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 刪除話題
exports.deleteTopic = async (req, res) => {
  try {
    const deletedTopic = await topicService.deleteTopic(req.params.id);

    if (!deletedTopic) {
      return res.status(404).json({
        status: "error",
        message: "Topic has already been deleted or does not exist",
      });
    }

    res.json({ status: "success", message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 恢復話題
exports.restoreTopic = async (req, res) => {
  try {
    const restoredTopic = await topicService.restoreTopic(req.params.id);

    if (!restoredTopic) {
      return res.status(404).json({
        status: "error",
        message: "Topic not found or not deleted",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Topic restored successfully",
      data: restoredTopic,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "An unexpected error occurred",
    });
  }
};

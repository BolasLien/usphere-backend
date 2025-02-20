const commentService = require("../services/commentService");

// 獲取指定話題下的所有留言
exports.getCommentsByTopicId = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByTopicId(req.params.id);
    res.json({
      status: "success",
      message: "留言列表獲取成功",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 在指定話題下發表新留言
exports.createComment = async (req, res) => {
  const topicId = req.params.id;
  const comment = req.body;
  const user = req.user;
  const token = req.token;

  try {
    const newComment = await commentService.createComment(
      topicId,
      comment,
      user,
      token
    );

    res
      .status(201)
      .json({ status: "success", message: "留言成功", data: newComment });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

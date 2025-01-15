const commentService = require("../services/commentService");

// 獲取指定話題下的所有留言
exports.getCommentsByTopicId = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByTopicId(req.params.id);
    res.json({ status: "success", message: "留言列表獲取成功", data: comments });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 在指定話題下發表新留言
exports.createComment = async (req, res) => {
  try {
    const newComment = await commentService.createComment(req.params.id, req.body);
    res.status(201).json({ status: "success", message: "留言成功", data: newComment });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 對指定留言進行按讚操作
exports.likeComment = async (req, res) => {
  try {
    const updatedComment = await commentService.likeComment(req.params.commentId);
    res.json({ status: "success", message: "留言按讚成功", data: updatedComment });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const likeService = require("../services/likeService");
const commentService = require("../services/commentService");
const topicService = require("../services/topicService");

exports.toggleLike = async (req, res) => {
  const { entity_id, entity_type } = req.body;
  const userId = "78223638-d195-44ae-8441-76b364eec8e2"; // 假設已經有 user id

  try {
    const { is_liked } = await likeService.toggleLike(
      userId,
      entity_id,
      entity_type
    );

    const updatedLikes = await likeService.getLikeCount(entity_id, entity_type);

    res.json({
      status: "success",
      message: is_liked ? "按讚成功" : "收回讚成功",
      data: { entity_id, likes: updatedLikes },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

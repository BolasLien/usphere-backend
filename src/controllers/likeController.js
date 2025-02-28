const likeService = require("../services/likeService");

exports.toggleLike = async (req, res) => {
  const userId = req.user.id;
  const token = req.token;
  const { entity_id, entity_type } = req.body;

  try {
    const { is_liked } = await likeService.toggleLike(
      userId,
      entity_id,
      entity_type,
      token
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

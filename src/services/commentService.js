const db = require("../utils/db");

// 獲取指定話題下的所有留言
exports.getCommentsByTopicId = async (topicId) => {
  const { data, error } = await db
    .from("comments_view")
    .select("*")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

// 在指定話題下發表新留言
exports.createComment = async (topicId, comment, user, token) => {
  comment.topic_id = topicId;
  comment.user_id = user.id;

  const { data, error } = await db
    .from("comments")
    .insert(comment)
    .select("content,created_at")
    .single()
    .setHeader("Authorization", `Bearer ${token}`);

  if (error) throw new Error(error.message);
  return data;
};

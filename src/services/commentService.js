const db = require("../utils/db");

// 獲取指定話題下的所有留言
exports.getCommentsByTopicId = async (topicId) => {
  const { data, error } = await db
    .from("comments")
    .select("*, users(display_name,profile_pic_url),likes(count)")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const comments = data.map((comment) => {
    comment.user_name = comment.users ? comment.users.display_name : "未知用戶";
    comment.user_pic = comment.users ? comment.users.profile_pic_url : "";
    comment.likes = comment.likes[0].count;
    const { user_id, users, topic_id, created_at, ...data } = comment;
    return data;
  });

  return comments;
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

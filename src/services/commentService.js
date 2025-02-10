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
exports.createComment = async (topicId, comment) => {
  comment.topic_id = topicId;
  comment.likes = 0;

  // TODO comment.user_id = req.user.id; 目前先寫死
  comment.user_id = "78223638-d195-44ae-8441-76b364eec8e2";

  const { data, error } = await db
    .from("comments")
    .insert(comment)
    .select("content,created_at")
    .single();

  if (error) throw new Error(error.message);
  return data;
};

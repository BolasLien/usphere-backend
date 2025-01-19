import db from "../utils/db";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  user_name: string;
  user_pic: string;
}

interface NewComment {
  content: string;
  topic_id: string;
  likes: number;
  user_id: string;
}

interface User {
  display_name: string;
  profile_pic_url: string;
}

interface CommentWithUser extends Comment {
  users: User;
}

// 獲取指定話題下的所有留言
export const getCommentsByTopicId = async (topicId: string): Promise<Comment[]> => {
  const { data, error } = await db
    .from("comments")
    .select("*, users(display_name,profile_pic_url)")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const comments = (data as CommentWithUser[]).map((comment) => {
    comment.user_name = comment.users ? comment.users.display_name : "未知用戶";
    comment.user_pic = comment.users ? comment.users.profile_pic_url : "";
    const { user_id, users, topic_id, created_at, ...data } = comment;
    return data;
  });

  return comments;
};

// 在指定話題下發表新留言
export const createComment = async (topicId: string, comment: NewComment): Promise<Partial<Comment>> => {
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

// TODO 對指定留言進行按讚操作，目前只是增加 likes 數量
export const likeComment = async (commentId: string): Promise<Comment> => {
  const { data, error } = await db
    .from("comments")
    .update({ likes: db.raw("likes + 1") })
    .eq("id", commentId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
};

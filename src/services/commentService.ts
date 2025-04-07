import db from "../utils/db";
import { Comment } from "../types/models";

// 獲取指定話題下的所有留言
export const getCommentsByTopicId = async (topicId: string): Promise<Comment[]> => {
  const { data, error } = await db
    .from("comments_view")
    .select("*")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as Comment[];
};

// 在指定話題下發表新留言
export const createComment = async (
  topicId: string,
  comment: Partial<Comment>,
  user: any,
  token: string | undefined
): Promise<Comment> => {
  comment.topic_id = topicId;
  comment.user_id = user.id;

  const { data, error } = await db
    .from("comments")
    .insert(comment)
    .select("content,created_at")
    .single()
    .setHeader("Authorization", `Bearer ${token}`);

  if (error) throw new Error(error.message);

  return data as Comment;
};

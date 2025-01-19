import { Request, Response } from "express";
import commentService from "../services/commentService";

// 獲取指定話題下的所有留言
export const getCommentsByTopicId = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await commentService.getCommentsByTopicId(req.params.id);
    res.json({ status: "success", message: "留言列表獲取成功", data: comments });
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
};

// 在指定話題下發表新留言
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const newComment = await commentService.createComment(req.params.id, req.body);
    res.status(201).json({ status: "success", message: "留言成功", data: newComment });
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
};

// 對指定留言進行按讚操作
export const likeComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedComment = await commentService.likeComment(req.params.commentId);
    res.json({ status: "success", message: "留言按讚成功", data: updatedComment });
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
};

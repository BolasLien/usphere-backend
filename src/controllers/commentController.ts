import { Request, Response } from "express";
import * as commentService from "../services/commentService";

// 獲取指定話題下的所有留言
export const getCommentsByTopicId = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getCommentsByTopicId(req.params.id);
    res.json({
      status: "success",
      message: "留言列表獲取成功",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
};

// 在指定話題下發表新留言
export const createComment = async (req: Request, res: Response) => {
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
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
};

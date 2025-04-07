import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json({ status: "success", message: "登入成功", ...result });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ status: "error", message: error.message || "登入失敗" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.token;
    await authService.logoutUser(token);
    res.json({ status: "success", message: "登出成功" });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ status: "error", message: error.message || "登出失敗" });
  }
};

export const whoami = async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    const user = await authService.whoami(userId);
    res.json({ status: "success", message: "取得使用者資訊成功", user });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ status: "error", message: error.message || "身份驗證失敗" });
  }
};

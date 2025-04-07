import { Request, Response } from 'express';
import * as userService from '../services/userService';

// 獲取所有用戶
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

// 獲取單個用戶
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

// 建立新用戶
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ status: 'success', data: newUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

// 更新用戶
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', data: updatedUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

// 刪除用戶
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

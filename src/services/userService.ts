import db from "../utils/db";
import { User } from "../types/models";

// 獲取所有用戶
export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await db.from("users").select("*");
  if (error) throw new Error(error.message);
  return data as User[];
};

// 獲取單個用戶
export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as User;
};

// 建立新用戶
export const createUser = async (user: Partial<User>): Promise<User> => {
  const { data, error } = await db.from("users").insert(user).select().single();
  if (error) throw new Error(error.message);
  return data as User;
};

// 更新用戶
export const updateUser = async (id: string, user: Partial<User>): Promise<User | null> => {
  const { data, error } = await db
    .from("users")
    .update(user)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as User;
};

// 刪除用戶
export const deleteUser = async (id: string): Promise<User | null> => {
  const { data, error } = await db.from("users").delete().eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data as User;
};

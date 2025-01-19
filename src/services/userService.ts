import db from '../utils/db';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

// 獲取所有用戶
export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await db.from('users').select('*');
  if (error) throw new Error(error.message);
  return data as User[];
};

// 獲取單個用戶
export const getUserById = async (id: string): Promise<User> => {
  const { data, error } = await db.from('users').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data as User;
};

// 創建新用戶
export const createUser = async (user: User): Promise<User> => {
  const { data, error } = await db.from('users').insert(user).single();
  if (error) throw new Error(error.message);
  return data as User;
};

// 更新用戶
export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const { data, error } = await db.from('users').update(user).eq('id', id).single();
  if (error) throw new Error(error.message);
  return data as User;
};

// 刪除用戶
export const deleteUser = async (id: string): Promise<User> => {
  const { data, error } = await db.from('users').delete().eq('id', id).single();
  if (error) throw new Error(error.message);
  return data as User;
};

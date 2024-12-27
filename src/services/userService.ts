import db from '../utils/db';

// 獲取所有用戶
export const getAllUsers = async (): Promise<any[]> => {
  const { data, error } = await db.from('users').select('*');
  if (error) throw new Error(error.message);
  return data;
};

// 獲取單個用戶
export const getUserById = async (id: string): Promise<any> => {
  const { data, error } = await db.from('users').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

// 創建新用戶
export const createUser = async (user: any): Promise<any> => {
  const { data, error } = await db.from('users').insert(user).single();
  if (error) throw new Error(error.message);
  return data;
};

// 更新用戶
export const updateUser = async (id: string, user: any): Promise<any> => {
  const { data, error } = await db.from('users').update(user).eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

// 刪除用戶
export const deleteUser = async (id: string): Promise<any> => {
  const { data, error } = await db.from('users').delete().eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

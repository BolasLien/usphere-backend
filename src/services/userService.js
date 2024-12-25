const db = require('../utils/db');

// 獲取所有用戶
exports.getAllUsers = async () => {
  const { data, error } = await db.from('users').select('*');
  if (error) throw new Error(error.message);
  return data;
};

// 獲取單個用戶
exports.getUserById = async (id) => {
  const { data, error } = await db.from('users').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

// 創建新用戶
exports.createUser = async (user) => {
  const { data, error } = await db.from('users').insert(user).single();
  if (error) throw new Error(error.message);
  return data;
};

// 更新用戶
exports.updateUser = async (id, user) => {
  const { data, error } = await db.from('users').update(user).eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

// 刪除用戶
exports.deleteUser = async (id) => {
  const { data, error } = await db.from('users').delete().eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

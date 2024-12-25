const db = require('../utils/db');

// 獲取所有話題
exports.getAllTopics = async () => {
  const { data, error } = await db.from('topics').select('*');
  if (error) throw new Error(error.message);
  return data;
};

// 獲取單個話題
exports.getTopicById = async (id) => {
  const { data, error } = await db.from('topics').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

// 創建新話題
exports.createTopic = async (topic) => {
  const { data, error } = await db.from('topics').insert(topic).single();
  if (error) throw new Error(error.message);
  return data;
};

// 更新話題
exports.updateTopic = async (id, topic) => {
  const { data, error } = await db.from('topics').update(topic).eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

// 刪除話題
exports.deleteTopic = async (id) => {
  const { data, error } = await db.from('topics').delete().eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

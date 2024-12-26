const db = require("../utils/db");
const logger = require("../utils/logger");

// 獲取所有話題
exports.getAllTopics = async (query) => {
  // 根據查詢參數過濾和排序話題
  const { sort, keyword, page = 1, tag } = query;
  const limit = 10;
  const offset = (page - 1) * limit;
  const { data, error } = await db
    .from("topics")
    .select("*")
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return data;
};

// 獲取單個話題
exports.getTopicById = async (id) => {
  const { data, error } = await db
    .from("topics")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// 創建新話題
exports.createTopic = async (topic) => {
  const { data, error } = await db.from("topics").insert(topic).single();
  if (error) throw new Error(error.message);
  return data;
};

// 更新話題
exports.updateTopic = async (id, topic) => {
  const { data, error } = await db
    .from("topics")
    .update(topic)
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data || {};
};

// 刪除話題
exports.deleteTopic = async (id) => {
  const { data, error } = await db
    .from("topics")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

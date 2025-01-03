const db = require("../utils/db");

// 獲取所有話題
exports.getAllTopics = async (query) => {
  const { sort = "newest", keyword, page = 1, limit = 10, tags } = query;
  const offset = (page - 1) * limit;

  // 構建查詢
  let dbQuery = db.from("topics").select("*");

  // 關鍵字過濾
  if (keyword) {
    dbQuery = dbQuery.or(
      `title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`
    );
  }

  // 標籤篩選
  if (tags) {
    dbQuery = dbQuery.contains("tags", [tags]); // 假設 tags 是 array 格式
  }

  // 排序
  if (sort === "newest") {
    dbQuery = dbQuery.order("created_at", { ascending: false });
  } else if (sort === "oldest") {
    dbQuery = dbQuery.order("created_at", { ascending: true });
  } else if (sort === "popular") {
    dbQuery = dbQuery.order("likes", { ascending: false });
  }

  // 分頁處理
  dbQuery = dbQuery.range(offset, offset + limit - 1);

  // 執行查詢
  const { data, error } = await dbQuery;

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

const db = require("../utils/db");

// 獲取所有話題
exports.getAllTopics = async (query) => {
  const { sort = "newest", keyword, page = 1, limit = 10, tags } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

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
  dbQuery = dbQuery.range(offset, offset + parseInt(limit) - 1);

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
  // TODO 暫時先給假的資料
  topic.author = "王小艾";
  topic.author_pic = "https://randomuser.me/api/portraits/women/21.jpg";
  topic.description = topic.content.substring(0, 30) + "...";
  topic.likes = 0;
  topic.comments = 0;
  topic.bookmarks = 0;

  const { data, error } = await db
    .from("topics")
    .insert(topic)
    .select() // 返回全部資料讓前端使用
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// 更新話題
exports.updateTopic = async (id, topic) => {
  if (topic.content) {
    topic.description = topic.content.substring(0, 30) + "...";
  }

  const { data, error } = await db
    .from("topics")
    .update(topic)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data || {};
};

// 刪除話題
exports.deleteTopic = async (id) => {
  const { data, error } = await db
    .from("topics")
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq("is_deleted", false)
    .eq("id", id)
    .select(); // 成功更新會返回該資料，失敗的話則是回空陣列

  if (error) {
    console.error("Error delete topic:", error);
    throw new Error("Failed to delete topic: " + error.message);
  }

  if (!data || data.length === 0) return null;

  return data;
};

const db = require("../utils/db");

// 回傳的欄位
const TOPIC_FIELDS =
  "id,title,content,created_at,tags,bookmarks,users:users (display_name,profile_pic_url),comments(count),likes(count)";

// 格式化話題資料
const formatTopic = (topic) => {
  return {
    ...topic,
    author: topic.users.display_name,
    author_pic: topic.users.profile_pic_url,
    users: undefined, // 移除 users 欄位
    comments: topic.comments[0].count, // 計算留言數量
    likes: topic.likes[0].count, // 計算按讚數量
  };
};

// 獲取所有話題
exports.getAllTopics = async (query) => {
  const { sort = "newest", keyword, page = 1, limit = 10, tags } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // 構建查詢
  let dbQuery = db.from("topics_view").select("*");

  // 關鍵字過濾
  if (keyword) {
    dbQuery = dbQuery.or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`);
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
    .from("topics_view")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return data;
};

// 創建新話題
exports.createTopic = async (topic, user, token) => {
  const { data, error } = await db
    .from("topics")
    .insert({ ...topic, user_id: user.id }) // 新增話題時要加入 user_id
    .select(TOPIC_FIELDS) // 返回全部資料讓前端使用
    .single()
    .setHeader("Authorization", `Bearer ${token}`);

  if (error) throw new Error(error.message);

  return formatTopic(data);
};

// 更新話題
exports.updateTopic = async (id, topic, token) => {
  const { data, error } = await db
    .from("topics")
    .update(topic) // 更新話題時要加入 user_id
    .eq("id", id)
    .select(TOPIC_FIELDS)
    .maybeSingle()
    .setHeader("Authorization", `Bearer ${token}`);

  if (!data) throw new Error("沒有編輯此話題的權限");
  if (error) throw new Error(error.message);

  return formatTopic(data) || {};
};

// 刪除話題
exports.deleteTopic = async (id, token) => {
  const { data, error } = await db
    .from("topics")
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq("is_deleted", false)
    .eq("id", id)
    .select(TOPIC_FIELDS) // 成功更新會返回該資料，失敗的話則是回空陣列
    .setHeader("Authorization", `Bearer ${token}`); // 設置 token 才能修改

  if (error) {
    console.error("Error delete topic:", error);
    throw new Error("Failed to delete topic: " + error.message);
  }

  if (!data || data.length === 0) return null;

  return data.map(formatTopic);
};

// 恢復話題
exports.restoreTopic = async (id, token) => {
  const { data, error } = await db
    .from("topics")
    .update({ is_deleted: false, deleted_at: null })
    .eq("is_deleted", true) // 確保只恢復已刪除的資料
    .eq("id", id)
    .select(TOPIC_FIELDS) // 返回更新的資料
    .setHeader("Authorization", `Bearer ${token}`); // 設置 token 才能修改

  if (error) {
    console.error("Error restoring topic:", error);
    throw new Error("Failed to restore topic: " + error.message);
  }

  if (!data || data.length === 0) return null;

  return data.map(formatTopic); // 返回恢復的資料
};

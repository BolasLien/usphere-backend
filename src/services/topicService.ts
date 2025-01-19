import db from "../utils/db";

interface Topic {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
  tags: string[];
  bookmarks: number;
  users: {
    display_name: string;
    profile_pic_url: string;
  };
  author?: string;
  author_pic?: string;
  is_deleted?: boolean;
  deleted_at?: string | null;
}

interface Query {
  sort?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  tags?: string;
}

// 回傳的欄位
const TOPIC_FIELDS =
  "id,title,content,likes,comments,created_at,tags,bookmarks,users:users (display_name,profile_pic_url)";

// 格式化話題資料
const formatTopic = (topic: Topic): Topic => {
  return {
    ...topic,
    author: topic.users.display_name,
    author_pic: topic.users.profile_pic_url,
    users: undefined, // 移除 users 欄位
  };
};

// 獲取所有話題
export const getAllTopics = async (query: Query): Promise<Topic[]> => {
  const { sort = "newest", keyword, page = 1, limit = 10, tags } = query;
  const offset = (parseInt(page.toString()) - 1) * parseInt(limit.toString());
  
  // 構建查詢
  let dbQuery = db.from("topics").select(TOPIC_FIELDS).eq("is_deleted", false);

  // 關鍵字過濾
  if (keyword) {
    dbQuery = dbQuery.or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`);
  }

  // 標籤篩選
  if (tags) {
    dbQuery = dbQuery.contains("tags", [tags]);
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
  dbQuery = dbQuery.range(offset, offset + parseInt(limit.toString()) - 1);

  // 執行查詢
  const { data, error } = await dbQuery;

  if (error) throw new Error(error.message);

  return data.map(formatTopic);
};

// 獲取單個話題
export const getTopicById = async (id: string): Promise<Topic | null> => {
  const { data, error } = await db
    .from("topics")
    .select(TOPIC_FIELDS)
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return formatTopic(data);
};

// 創建新話題
export const createTopic = async (topic: Topic): Promise<Topic> => {
  // TODO 暫時先給假的資料
  topic.user_id = "78223638-d195-44ae-8441-76b364eec8e2";
  topic.likes = 0;
  topic.comments = 0;
  topic.bookmarks = 0;

  const { data, error } = await db
    .from("topics")
    .insert(topic)
    .select(TOPIC_FIELDS) // 返回全部資料讓前端使用
    .single();
  if (error) throw new Error(error.message);

  return formatTopic(data);
};

// 更新話題
export const updateTopic = async (id: string, topic: Partial<Topic>): Promise<Topic> => {
  const { data, error } = await db
    .from("topics")
    .update(topic)
    .eq("id", id)
    .select(TOPIC_FIELDS)
    .single();
  if (error) throw new Error(error.message);

  return formatTopic(data) || {};
};

// 刪除話題
export const deleteTopic = async (id: string): Promise<Topic | null> => {
  const { data, error } = await db
    .from("topics")
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq("is_deleted", false)
    .eq("id", id)
    .select(TOPIC_FIELDS); // 成功更新會返回該資料，失敗的話則是回空陣列

  if (error) {
    console.error("Error delete topic:", error);
    throw new Error("Failed to delete topic: " + error.message);
  }

  if (!data || data.length === 0) return null;

  return data.map(formatTopic);
};

// 恢復話題
export const restoreTopic = async (id: string): Promise<Topic | null> => {
  const { data, error } = await db
    .from("topics")
    .update({ is_deleted: false, deleted_at: null })
    .eq("is_deleted", true) // 確保只恢復已刪除的資料
    .eq("id", id)
    .select(TOPIC_FIELDS); // 返回更新的資料

  if (error) {
    console.error("Error restoring topic:", error);
    throw new Error("Failed to restore topic: " + error.message);
  }

  if (!data || data.length === 0) return null;

  return data.map(formatTopic); // 返回恢復的資料
};

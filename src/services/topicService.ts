import db from "../utils/db";
import { Topic, QueryParams } from "../types/models";

// 回傳的欄位
const TOPIC_FIELDS =
  "id,title,content,created_at,tags,bookmarks,users:users (display_name,profile_pic_url),comments(count),likes(count)";

// 格式化話題資料
const formatTopic = (topic: any): any => {
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
export const getAllTopics = async (query: QueryParams, token: string | null): Promise<any[]> => {
  const { sort = "newest", keyword, page = 1, limit = 10, tags } = query;
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : (page as number);
  const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : (limit as number);
  const offset = (pageNum - 1) * limitNum;

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
  dbQuery = dbQuery.range(offset, offset + limitNum - 1);

  const { error: userError } = await db.auth.getUser(token || "");

  if (token && !userError) {
    dbQuery = dbQuery.setHeader("Authorization", `Bearer ${token}`);
  }

  // 執行查詢
  const { data, error } = await dbQuery;

  if (error) {
    throw new Error(typeof error.message === 'string' ? error.message : '獲取主題失敗');
  }

  if (!token || userError) {
    return data.map((topic: any) => ({
      ...topic,
      can_edit_topics: false,
    }));
  }

  return data;
};

// 獲取單個話題
export const getTopicById = async (id: string, token: string | null): Promise<any | null> => {
  let query = db.from("topics_view").select("*").eq("id", id).single();

  const { error: userError } = await db.auth.getUser(token || "");

  if (token && !userError) {
    query = query.setHeader("Authorization", `Bearer ${token}`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(typeof error.message === 'string' ? error.message : '獲取主題失敗');
  }

  if (!data) return null;

  if (!token || userError) {
    return {
      ...data,
      can_edit_topics: false
    };
  }

  return data;
};

// 建立新話題
export const createTopic = async (topic: Partial<Topic>, user: any, token: string | undefined): Promise<any> => {
  const { data, error } = await db
    .from("topics")
    .insert({ ...topic, user_id: user.id }) // 新增話題時要加入 user_id
    .select(TOPIC_FIELDS) // 返回全部資料讓前端使用
    .single()
    .setHeader("Authorization", `Bearer ${token}`);

  if (error) {
    throw new Error(typeof error.message === 'string' ? error.message : '建立主題失敗');
  }

  return formatTopic(data);
};

// 更新話題
export const updateTopic = async (id: string, topic: Partial<Topic>, token: string | undefined): Promise<any> => {
  const { data, error } = await db
    .from("topics")
    .update(topic)
    .eq("id", id)
    .select(TOPIC_FIELDS)
    .maybeSingle()
    .setHeader("Authorization", `Bearer ${token}`);

  if (!data) throw new Error("沒有編輯此話題的權限");

  if (error) {
    throw new Error(typeof error.message === 'string' ? error.message : '更新主題失敗');
  }

  return formatTopic(data) || {};
};

// 刪除話題
export const deleteTopic = async (id: string, token: string | undefined): Promise<any[] | null> => {
  const { data, error } = await db
    .from("topics")
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq("is_deleted", false)
    .eq("id", id)
    .select(TOPIC_FIELDS) // 成功更新會返回該資料，失敗的話則是回空陣列
    .setHeader("Authorization", `Bearer ${token}`); // 設置 token 才能修改

  if (error) {
    console.error("Error delete topic:", error);
    throw new Error(typeof error.message === 'string' ? error.message : '刪除主題失敗');
  }

  if (!data || data.length === 0) return null;

  return data.map(formatTopic);
};

// 恢復話題
export const restoreTopic = async (id: string, token: string | undefined): Promise<any[] | null> => {
  const { data, error } = await db
    .from("topics")
    .update({ is_deleted: false, deleted_at: null })
    .eq("is_deleted", true) // 確保只恢復已刪除的資料
    .eq("id", id)
    .select(TOPIC_FIELDS) // 返回更新的資料
    .setHeader("Authorization", `Bearer ${token}`); // 設置 token 才能修改

  if (error) {
    console.error("Error restoring topic:", error);
    throw new Error(typeof error.message === 'string' ? error.message : '恢復主題失敗');
  }

  if (!data || data.length === 0) return null;

  return data.map(formatTopic); // 返回恢復的資料
};

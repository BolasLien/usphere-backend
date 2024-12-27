import db from "../utils/db";
import logger from "../utils/logger";

interface Query {
  sort?: string;
  keyword?: string;
  page?: number;
  tag?: string;
}

interface Topic {
  id?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

// 獲取所有話題
export const getAllTopics = async (query: Query): Promise<Topic[]> => {
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
export const getTopicById = async (id: number): Promise<Topic> => {
  const { data, error } = await db
    .from("topics")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// 創建新話題
export const createTopic = async (topic: Topic): Promise<Topic> => {
  const { data, error } = await db.from("topics").insert(topic).single();
  if (error) throw new Error(error.message);
  return data;
};

// 更新話題
export const updateTopic = async (id: number, topic: Topic): Promise<Topic> => {
  const { data, error } = await db
    .from("topics")
    .update(topic)
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data || {};
};

// 刪除話題
export const deleteTopic = async (id: number): Promise<Topic> => {
  const { data, error } = await db
    .from("topics")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

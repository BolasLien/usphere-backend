export interface User {
  id: string;
  username: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any; // 允許其他可能的屬性
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  [key: string]: any; // 允許其他可能的屬性
}

export interface Comment {
  id: string;
  content: string;
  topic_id: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any; // 允許其他可能的屬性
}

export interface Like {
  id?: string;
  user_id: string;
  entity_id: string;
  entity_type: 'topic' | 'comment';
  created_at?: Date;
  [key: string]: any;
}

export interface LikeResponse {
  is_liked: boolean;
  [key: string]: any;
}

export interface QueryParams {
  limit?: number;
  offset?: number;
  order?: string;
  sort?: string;
  search?: string;
  [key: string]: any;
}

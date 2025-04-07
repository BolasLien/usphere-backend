import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// 擴展 Request 型別，加入 user 和 token 屬性
declare module 'express' {
  interface Request {
    user?: any;
    token?: string;
  }
}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ status: "error", message: "身份驗證失敗" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      res
        .status(error.status || 401)
        .json({ status: "error", message: error.message });
      return;
    }

    if (!data.user) {
      res.status(401).json({ status: "error", message: "身份驗證失敗" });
      return;
    }

    // 驗證成功，將 user 資訊放到 req 物件
    req.user = data.user;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ status: "error", message: "伺服器錯誤" });
    return;
  }
};

export default authMiddleware;

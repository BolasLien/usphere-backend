const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "error", message: "身份驗證失敗" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res
        .status(error.status)
        .json({ status: "error", message: error.message });
    }

    if (!data.user) {
      return res.status(401).json({ status: "error", message: "身份驗證失敗" });
    }

    // 驗證成功，將 user 資訊放到 req 物件
    req.user = data.user;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ status: "error", message: "伺服器錯誤" });
  }
};

module.exports = authMiddleware;

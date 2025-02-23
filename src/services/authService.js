const supabase = require("../utils/db");
const userService = require("./userService");

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: "Email 與密碼必填" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw { status: 401, message: "帳號或密碼錯誤" };
  }

  const user = await userService.getUserById(data.user.id);

  return {
    access_token: data.session.access_token,
    user: {
      id: user.id,
      name: user.display_name,
      pic: user.profile_pic_url,
    },
  };
};

const logoutUser = async (access_token) => {
  const { error } = await supabase.auth.admin.signOut(access_token);

  if (error) {
    throw { status: 500, message: "登出失敗" };
  }
};

const whoami = async (access_token) => {
  const { data, error } = await supabase.auth.getUser(access_token);

  if (error) {
    throw { status: 401, message: "身份驗證失敗" };
  }

  const user = await userService.getUserById(data.user.id);

  if (!user) {
    throw { status: 404, message: "使用者資料不存在" };
  }

  return {
    id: user.id,
    name: user.display_name,
    pic: user.profile_pic_url,
  };
};

module.exports = { loginUser, logoutUser, whoami };

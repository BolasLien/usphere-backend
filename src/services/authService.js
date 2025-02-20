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

module.exports = { loginUser };

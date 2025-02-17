const supabase = require("../utils/db");

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: 'Email 與密碼必填' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw { status: 401, message: '帳號或密碼錯誤' };
  }

  return {
    access_token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  };
};

module.exports = { loginUser };

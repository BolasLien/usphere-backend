const authService = require("../services/authService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json({ status: "success", message: "登入成功", ...result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ status: "error", message: error.message || "登入失敗" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.token;

    await authService.logoutUser(token);
    res.json({ status: "success", message: "登出成功" });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ status: "error", message: error.message || "登出失敗" });
  }
};

const whoami = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await authService.whoami(userId);
    res.json({ status: "success", message: "取得使用者資訊成功", user });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ status: "error", message: error.message || "身份驗證失敗" });
  }
};

module.exports = { login, logout, whoami };

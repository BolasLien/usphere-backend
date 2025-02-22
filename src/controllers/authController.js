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
    const { access_token } = req.body;
    await authService.logoutUser(access_token);
    res.json({ status: "success", message: "登出成功" });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ status: "error", message: error.message || "登出失敗" });
  }
};

module.exports = { login, logout };

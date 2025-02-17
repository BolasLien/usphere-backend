const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || '內部伺服器錯誤' });
  }
};

module.exports = { login };

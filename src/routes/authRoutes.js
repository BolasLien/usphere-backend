const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.get("/whoami", authMiddleware, authController.whoami);

module.exports = router;

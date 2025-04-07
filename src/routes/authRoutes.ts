import express, { Router, RequestHandler } from "express";
import * as authController from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/login", authController.login as unknown as RequestHandler);
router.post("/logout", authMiddleware, authController.logout as unknown as RequestHandler);
router.get("/whoami", authMiddleware, authController.whoami as unknown as RequestHandler);

export default router;

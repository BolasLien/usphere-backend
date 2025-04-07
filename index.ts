import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./src/routes";
import logger from "./src/utils/logger";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || "3000", 10);

// 設定 CORS 中介軟體，允許多個來源
const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

const corsOptions: cors.CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions)); // 使用 cors 中介軟體
app.use(express.json());
app.use(routes);

logger.info("Express app 已經啟動");

app.listen(port, () => {
  console.log(`API server is 執行 on http://localhost:${port}`);
});

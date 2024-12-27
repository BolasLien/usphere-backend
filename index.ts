import express, { Express } from 'express';
import userRoutes from './src/routes/userRoutes';
import topicRoutes from './src/routes/topicRoutes';
import logger from './src/utils/logger';

const app: Express = express();
const port: number = 3000;

app.use(express.json());
app.use('/users', userRoutes);
app.use('/topics', topicRoutes);

logger.info('Express app 已經啟動');

app.listen(port, () => {
  console.log(`API server is 執行 on http://localhost:${port}`);
});

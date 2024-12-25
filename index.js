const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const topicRoutes = require('./src/routes/topicRoutes');
const logger = require('./src/utils/logger');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/users', userRoutes);
app.use('/topics', topicRoutes);

logger.info('Express app 已經啟動');
// ...existing code...

app.listen(port, () => {
  console.log(`API server is 執行 on http://localhost:${port}`);
});

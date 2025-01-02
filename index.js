const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const topicRoutes = require('./src/routes/topicRoutes');
const logger = require('./src/utils/logger');
const app = express();
const port = 3000;

// 設定 CORS 中介軟體，允許多個來源
const allowedOrigins = ['http://localhost:5173', 'https://wangyingju.github.io/USphere/'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // 使用 cors 中介軟體
app.use(express.json());
app.use('/users', userRoutes);
app.use('/topics', topicRoutes);

logger.info('Express app 已經啟動');
// ...existing code...

app.listen(port, () => {
  console.log(`API server is 執行 on http://localhost:${port}`);
});

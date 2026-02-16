const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀  TurmaBoard API rodando em http://localhost:${PORT}`);
    console.log(`📖  Health check → http://localhost:${PORT}/health`);
  });
};

start();

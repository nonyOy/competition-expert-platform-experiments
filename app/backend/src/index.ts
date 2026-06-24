import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { authRouter } from './routes/auth.js';
import { dataRouter } from './routes/data.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3100);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'competition-expert-backend' });
});

app.use('/api/auth', authRouter);
app.use('/api', dataRouter);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ message: error.message || '服务器内部错误' });
});

app.listen(port, () => {
  console.log(`Competition expert backend running at http://localhost:${port}`);
});


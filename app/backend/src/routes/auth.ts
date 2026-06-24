import { Router } from 'express';
import { queryRows } from '../db/pool.js';
import { users } from '../services/mockData.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ message: '请输入账号和密码' });
    return;
  }

  try {
    const rows = await queryRows<{
      id: number;
      username: string;
      role: 'admin' | 'expert';
      display_name: string;
      expert_id?: number;
    }>(
      `SELECT u.id, u.username, u.role, u.display_name, e.id AS expert_id
       FROM users u
       LEFT JOIN experts e ON e.user_id = u.id
       WHERE u.username = :username AND u.password = :password
       LIMIT 1`,
      { username, password }
    );

    const user = rows[0];
    if (!user) {
      res.status(401).json({ message: '账号或密码错误' });
      return;
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      displayName: user.display_name,
      expertId: user.expert_id
    });
  } catch (error) {
    const fallbackEnabled = process.env.USE_MOCK_WHEN_DB_FAILED !== 'false';
    if (!fallbackEnabled) {
      throw error;
    }

    const user = users.find((item) => item.username === username && item.password === password);
    if (!user) {
      res.status(401).json({ message: '账号或密码错误' });
      return;
    }
    const { password: _password, ...safeUser } = user;
    res.json(safeUser);
  }
});

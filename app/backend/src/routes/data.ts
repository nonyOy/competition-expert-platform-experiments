import { Router } from 'express';
import { queryRows } from '../db/pool.js';
import { competitions, experts, scores, tasks, works } from '../services/mockData.js';

export const dataRouter = Router();

function mapStatus(status: string) {
  const names: Record<string, string> = {
    draft: '筹备中',
    reviewing: '评审中',
    finished: '已结束',
    submitted: '待分配',
    assigned: '已分配',
    reviewed: '已评审',
    pending: '待评审',
    scored: '已评分'
  };
  return names[status] || status;
}

dataRouter.get('/competitions', async (_req, res) => {
  try {
    const rows = await queryRows(
      `SELECT id, name, category, status, start_date AS startDate, end_date AS endDate, description
       FROM competitions
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch {
    res.json(competitions);
  }
});

dataRouter.post('/competitions', async (req, res) => {
  const payload = req.body as { name: string; category: string; startDate: string; endDate: string; description?: string };
  try {
    await queryRows(
      `INSERT INTO competitions (name, category, status, start_date, end_date, description)
       VALUES (:name, :category, 'draft', :startDate, :endDate, :description)`,
      { ...payload, description: payload.description || '' }
    );
    res.status(201).json({ message: '赛事创建成功' });
  } catch {
    const item = { id: competitions.length + 1, status: 'draft', ...payload, description: payload.description || '' };
    competitions.push(item);
    res.status(201).json(item);
  }
});

dataRouter.get('/experts', async (_req, res) => {
  try {
    const rows = await queryRows(
      `SELECT id, user_id AS userId, name, title, specialty, phone, email, enabled
       FROM experts
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch {
    res.json(experts);
  }
});

dataRouter.get('/works', async (_req, res) => {
  try {
    const rows = await queryRows(
      `SELECT w.id, w.competition_id AS competitionId, c.name AS competitionName,
              w.title, w.author, w.organization, w.summary, w.status
       FROM works w
       JOIN competitions c ON c.id = w.competition_id
       ORDER BY w.id DESC`
    );
    res.json(rows);
  } catch {
    res.json(works);
  }
});

dataRouter.get('/review-tasks', async (req, res) => {
  const expertId = req.query.expertId ? Number(req.query.expertId) : undefined;
  try {
    const rows = await queryRows(
      `SELECT t.id, t.competition_id AS competitionId, c.name AS competitionName,
              t.work_id AS workId, w.title AS workTitle, w.author, w.organization, w.summary,
              t.expert_id AS expertId, e.name AS expertName, t.status, t.deadline,
              s.total_score AS totalScore, s.comment
       FROM review_tasks t
       JOIN competitions c ON c.id = t.competition_id
       JOIN works w ON w.id = t.work_id
       JOIN experts e ON e.id = t.expert_id
       LEFT JOIN scores s ON s.task_id = t.id
       ${expertId ? 'WHERE t.expert_id = :expertId' : ''}
       ORDER BY t.id DESC`,
      { expertId }
    );
    res.json(rows);
  } catch {
    const rows = expertId ? tasks.filter((item) => item.expertId === expertId) : tasks;
    res.json(rows.map((task) => ({ ...task, ...works.find((work) => work.id === task.workId) })));
  }
});

dataRouter.post('/scores', async (req, res) => {
  const { taskId, innovationScore, practiceScore, presentationScore, comment } = req.body as {
    taskId: number;
    innovationScore: number;
    practiceScore: number;
    presentationScore: number;
    comment: string;
  };
  const totalScore = Number(innovationScore) + Number(practiceScore) + Number(presentationScore);

  try {
    await queryRows(
      `INSERT INTO scores (task_id, innovation_score, practice_score, presentation_score, total_score, comment)
       VALUES (:taskId, :innovationScore, :practiceScore, :presentationScore, :totalScore, :comment)`,
      { taskId, innovationScore, practiceScore, presentationScore, totalScore, comment }
    );
    await queryRows(`UPDATE review_tasks SET status = 'scored' WHERE id = :taskId`, { taskId });
    res.status(201).json({ message: '评分提交成功', totalScore });
  } catch {
    scores.push({ id: scores.length + 1, taskId, innovationScore, practiceScore, presentationScore, totalScore, comment });
    const task = tasks.find((item) => item.id === taskId);
    if (task) {
      task.status = 'scored';
    }
    res.status(201).json({ message: '评分提交成功', totalScore });
  }
});

dataRouter.get('/statistics', async (_req, res) => {
  try {
    const ranking = await queryRows(
      `SELECT w.id AS workId, w.title AS workTitle, c.name AS competitionName,
              ROUND(AVG(s.total_score), 2) AS averageScore, COUNT(s.id) AS scoreCount
       FROM works w
       JOIN competitions c ON c.id = w.competition_id
       LEFT JOIN review_tasks t ON t.work_id = w.id
       LEFT JOIN scores s ON s.task_id = t.id
       GROUP BY w.id, w.title, c.name
       ORDER BY averageScore DESC`
    );
    const overview = await queryRows<{ totalCompetitions: number; totalExperts: number; pendingTasks: number; averageScore: number }>(
      `SELECT
         (SELECT COUNT(*) FROM competitions) AS totalCompetitions,
         (SELECT COUNT(*) FROM experts) AS totalExperts,
         (SELECT COUNT(*) FROM review_tasks WHERE status = 'pending') AS pendingTasks,
         (SELECT ROUND(AVG(total_score), 2) FROM scores) AS averageScore`
    );
    res.json({ overview: overview[0], ranking });
  } catch {
    const ranking = works.map((work) => {
      const taskIds = tasks.filter((task) => task.workId === work.id).map((task) => task.id);
      const workScores = scores.filter((score) => taskIds.includes(score.taskId));
      const averageScore = workScores.length ? Math.round(workScores.reduce((sum, score) => sum + score.totalScore, 0) / workScores.length) : 0;
      return { workId: work.id, workTitle: work.title, competitionName: work.competitionName, averageScore, scoreCount: workScores.length };
    });
    res.json({
      overview: {
        totalCompetitions: competitions.length,
        totalExperts: experts.length,
        pendingTasks: tasks.filter((task) => task.status === 'pending').length,
        averageScore: 87
      },
      ranking,
      statusText: mapStatus
    });
  }
});

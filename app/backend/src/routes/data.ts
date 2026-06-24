import { Router } from 'express';
import { executeSql, queryRows } from '../db/pool.js';
import {
  competitions,
  expertApplicationActivities,
  expertApplicationHonors,
  expertApplications,
  experts,
  scores,
  tasks,
  users,
  works,
  type ApplicationStatus
} from '../services/mockData.js';

export const dataRouter = Router();

type ExpertApplicationPayload = {
  track: string;
  majorCategory: string;
  name: string;
  gender: string;
  ethnicity: string;
  birthMonth: string;
  phone: string;
  politicsStatus: string;
  educationDegree: string;
  healthStatus: string;
  email: string;
  workplace: string;
  workYears: number;
  position: string;
  specialtyDirection: string;
  titleQualification: string;
  idCard: string;
  unitOpinion?: string;
  instituteOpinion?: string;
  departmentOpinion?: string;
  finalOpinion?: string;
  activities?: Array<{ year: string; eventName: string; competitionLevel: string; duty: string }>;
  honors?: Array<{ honorName: string }>;
};

function buildApplicationDetail(application: (typeof expertApplications)[number]) {
  return {
    ...application,
    activities: expertApplicationActivities.filter((item) => item.applicationId === application.id),
    honors: expertApplicationHonors.filter((item) => item.applicationId === application.id)
  };
}

function createExpertFromApplication(application: (typeof expertApplications)[number]) {
  let user = users.find((item) => item.username === application.phone);
  if (!user) {
    const userId = Math.max(...users.map((item) => item.id), 0) + 1;
    const expertId = Math.max(...experts.map((item) => item.id), 0) + 1;
    user = {
      id: userId,
      username: application.phone,
      password: '123456',
      role: 'expert',
      displayName: `${application.name}专家`,
      expertId
    };
    users.push(user);
    experts.push({
      id: expertId,
      userId,
      name: application.name,
      title: application.titleQualification,
      specialty: application.specialtyDirection,
      phone: application.phone,
      email: application.email,
      enabled: true
    });
  }
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
    res.json(rows.map((task) => ({ ...works.find((work) => work.id === task.workId), ...task })));
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

dataRouter.post('/expert-applications', async (req, res) => {
  const payload = req.body as ExpertApplicationPayload;
  if (!payload.name || !payload.phone || !payload.track || !payload.majorCategory) {
    res.status(400).json({ message: '请填写姓名、手机号、申请赛道和专业大类' });
    return;
  }

  try {
    const result = await executeSql(
      `INSERT INTO expert_applications
       (track, major_category, name, gender, ethnicity, birth_month, phone, politics_status, education_degree,
        health_status, email, workplace, work_years, position, specialty_direction, title_qualification,
        id_card, unit_opinion, institute_opinion, department_opinion, final_opinion, status)
       VALUES (:track, :majorCategory, :name, :gender, :ethnicity, :birthMonth, :phone, :politicsStatus, :educationDegree,
        :healthStatus, :email, :workplace, :workYears, :position, :specialtyDirection, :titleQualification,
        :idCard, :unitOpinion, :instituteOpinion, :departmentOpinion, :finalOpinion, 'pending')`,
      {
        ...payload,
        unitOpinion: payload.unitOpinion || '',
        instituteOpinion: payload.instituteOpinion || '',
        departmentOpinion: payload.departmentOpinion || '',
        finalOpinion: payload.finalOpinion || ''
      }
    );
    const applicationId = result.insertId;
    for (const item of payload.activities || []) {
      await queryRows(
        `INSERT INTO expert_application_activities (application_id, year, event_name, competition_level, duty)
         VALUES (:applicationId, :year, :eventName, :competitionLevel, :duty)`,
        { applicationId, ...item }
      );
    }
    for (const item of (payload.honors || []).slice(0, 3)) {
      await queryRows(
        `INSERT INTO expert_application_honors (application_id, honor_name)
         VALUES (:applicationId, :honorName)`,
        { applicationId, ...item }
      );
    }
    res.status(201).json({ message: '报名申请已提交，请等待管理员审核', id: applicationId });
  } catch {
    const id = Math.max(...expertApplications.map((item) => item.id), 0) + 1;
    expertApplications.push({
      id,
      track: payload.track,
      majorCategory: payload.majorCategory,
      name: payload.name,
      gender: payload.gender,
      ethnicity: payload.ethnicity,
      birthMonth: payload.birthMonth,
      phone: payload.phone,
      politicsStatus: payload.politicsStatus,
      educationDegree: payload.educationDegree,
      healthStatus: payload.healthStatus,
      email: payload.email,
      workplace: payload.workplace,
      workYears: Number(payload.workYears || 0),
      position: payload.position,
      specialtyDirection: payload.specialtyDirection,
      titleQualification: payload.titleQualification,
      idCard: payload.idCard,
      unitOpinion: payload.unitOpinion || '',
      instituteOpinion: payload.instituteOpinion || '',
      departmentOpinion: payload.departmentOpinion || '',
      finalOpinion: payload.finalOpinion || '',
      status: 'pending',
      reviewOpinion: '',
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      reviewedAt: ''
    });
    for (const item of payload.activities || []) {
      expertApplicationActivities.push({ id: expertApplicationActivities.length + 1, applicationId: id, ...item });
    }
    for (const item of (payload.honors || []).slice(0, 3)) {
      expertApplicationHonors.push({ id: expertApplicationHonors.length + 1, applicationId: id, ...item });
    }
    res.status(201).json({ message: '报名申请已提交，请等待管理员审核', id });
  }
});

dataRouter.get('/expert-applications', async (req, res) => {
  const status = req.query.status as ApplicationStatus | undefined;
  try {
    const rows = await queryRows(
      `SELECT id, track, major_category AS majorCategory, name, gender, phone, workplace,
              specialty_direction AS specialtyDirection, title_qualification AS titleQualification,
              status, review_opinion AS reviewOpinion, created_at AS createdAt, reviewed_at AS reviewedAt
       FROM expert_applications
       ${status ? 'WHERE status = :status' : ''}
       ORDER BY id DESC`,
      { status }
    );
    res.json(rows);
  } catch {
    const rows = status ? expertApplications.filter((item) => item.status === status) : expertApplications;
    res.json(rows.map((item) => ({
      id: item.id,
      track: item.track,
      majorCategory: item.majorCategory,
      name: item.name,
      gender: item.gender,
      phone: item.phone,
      workplace: item.workplace,
      specialtyDirection: item.specialtyDirection,
      titleQualification: item.titleQualification,
      status: item.status,
      reviewOpinion: item.reviewOpinion,
      createdAt: item.createdAt,
      reviewedAt: item.reviewedAt
    })));
  }
});

dataRouter.get('/expert-applications/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const rows = await queryRows(
      `SELECT id, track, major_category AS majorCategory, name, gender, ethnicity, birth_month AS birthMonth,
              phone, politics_status AS politicsStatus, education_degree AS educationDegree, health_status AS healthStatus,
              email, workplace, work_years AS workYears, position, specialty_direction AS specialtyDirection,
              title_qualification AS titleQualification, id_card AS idCard, unit_opinion AS unitOpinion,
              institute_opinion AS instituteOpinion, department_opinion AS departmentOpinion, final_opinion AS finalOpinion,
              status, review_opinion AS reviewOpinion, created_at AS createdAt, reviewed_at AS reviewedAt
       FROM expert_applications
       WHERE id = :id`,
      { id }
    );
    const application = rows[0] as Record<string, unknown> | undefined;
    if (!application) {
      res.status(404).json({ message: '申请不存在' });
      return;
    }
    const activities = await queryRows(
      `SELECT id, year, event_name AS eventName, competition_level AS competitionLevel, duty
       FROM expert_application_activities WHERE application_id = :id`,
      { id }
    );
    const honors = await queryRows(
      `SELECT id, honor_name AS honorName
       FROM expert_application_honors WHERE application_id = :id`,
      { id }
    );
    res.json({ ...application, activities, honors });
  } catch {
    const application = expertApplications.find((item) => item.id === id);
    if (!application) {
      res.status(404).json({ message: '申请不存在' });
      return;
    }
    res.json(buildApplicationDetail(application));
  }
});

dataRouter.post('/expert-applications/:id/review', async (req, res) => {
  const id = Number(req.params.id);
  const { status, reviewOpinion } = req.body as { status: ApplicationStatus; reviewOpinion?: string };
  if (!['approved', 'rejected'].includes(status)) {
    res.status(400).json({ message: '审核状态不正确' });
    return;
  }

  try {
    await queryRows(
      `UPDATE expert_applications
       SET status = :status, review_opinion = :reviewOpinion, reviewed_at = NOW()
       WHERE id = :id`,
      { id, status, reviewOpinion: reviewOpinion || '' }
    );
    if (status === 'approved') {
      const rows = await queryRows<{ id: number; phone: string; name: string; titleQualification: string; specialtyDirection: string; email: string }>(
        `SELECT id, phone, name, title_qualification AS titleQualification, specialty_direction AS specialtyDirection, email
         FROM expert_applications WHERE id = :id`,
        { id }
      );
      const application = rows[0];
      if (application) {
        await queryRows(
          `INSERT IGNORE INTO users (username, password, role, display_name)
           VALUES (:phone, '123456', 'expert', :displayName)`,
          { phone: application.phone, displayName: `${application.name}专家` }
        );
        await queryRows(
          `INSERT INTO experts (user_id, name, title, specialty, phone, email, enabled)
           SELECT u.id, :name, :title, :specialty, :phone, :email, 1
           FROM users u
           WHERE u.username = :phone
             AND NOT EXISTS (SELECT 1 FROM experts e WHERE e.phone = :phone)`,
          {
            name: application.name,
            title: application.titleQualification,
            specialty: application.specialtyDirection,
            phone: application.phone,
            email: application.email
          }
        );
      }
    }
    res.json({ message: status === 'approved' ? '已通过申请并加入专家库' : '已驳回申请' });
  } catch {
    const application = expertApplications.find((item) => item.id === id);
    if (!application) {
      res.status(404).json({ message: '申请不存在' });
      return;
    }
    application.status = status;
    application.reviewOpinion = reviewOpinion || '';
    application.reviewedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (status === 'approved') {
      createExpertFromApplication(application);
    }
    res.json({ message: status === 'approved' ? '已通过申请并加入专家库' : '已驳回申请' });
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
    const overview = await queryRows<{ totalCompetitions: number; totalExperts: number; pendingTasks: number; averageScore: number; pendingApplications: number }>(
      `SELECT
         (SELECT COUNT(*) FROM competitions) AS totalCompetitions,
         (SELECT COUNT(*) FROM experts) AS totalExperts,
         (SELECT COUNT(*) FROM review_tasks WHERE status = 'pending') AS pendingTasks,
         (SELECT ROUND(AVG(total_score), 2) FROM scores) AS averageScore,
         (SELECT COUNT(*) FROM expert_applications WHERE status = 'pending') AS pendingApplications`
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
        averageScore: 87,
        pendingApplications: expertApplications.filter((item) => item.status === 'pending').length
      },
      ranking
    });
  }
});

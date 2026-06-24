export type UserRole = 'admin' | 'expert';

export const users = [
  { id: 1, username: 'admin', password: '123456', role: 'admin' as UserRole, displayName: '平台管理员' },
  { id: 2, username: 'expert01', password: '123456', role: 'expert' as UserRole, displayName: '李明专家', expertId: 1 }
];

export const competitions = [
  { id: 1, name: '2026 校园数字创意作品赛', category: '数字媒体', status: 'reviewing', startDate: '2026-05-01', endDate: '2026-07-10', description: '面向学生的数字创意、交互设计与多媒体作品竞赛。' },
  { id: 2, name: '大学生软件创新挑战赛', category: '软件开发', status: 'draft', startDate: '2026-06-15', endDate: '2026-08-20', description: '以应用创新、工程质量和演示表现为核心评分指标。' },
  { id: 3, name: '智能应用原型设计赛', category: '人工智能', status: 'finished', startDate: '2026-03-01', endDate: '2026-04-30', description: '关注 AI 应用场景、产品原型与社会价值。' }
];

export const experts = [
  { id: 1, userId: 2, name: '李明', title: '副教授', specialty: '数字媒体设计、交互体验', phone: '13800000001', email: 'liming@example.com', enabled: true },
  { id: 2, userId: 3, name: '王宁', title: '高级工程师', specialty: '软件工程、人工智能应用', phone: '13800000002', email: 'wangning@example.com', enabled: true }
];

export const works = [
  { id: 1, competitionId: 1, competitionName: '2026 校园数字创意作品赛', title: '城市记忆交互影像系统', author: '张晨', organization: '数字媒体 2301 班', summary: '基于城市老照片与实时交互装置的沉浸式作品。', status: 'assigned' },
  { id: 2, competitionId: 1, competitionName: '2026 校园数字创意作品赛', title: '校园导览 AR 小程序', author: '陈思雨', organization: '软件 2302 班', summary: '通过 AR 标注教学楼、路线和活动信息。', status: 'assigned' },
  { id: 3, competitionId: 2, competitionName: '大学生软件创新挑战赛', title: '低碳生活积分平台', author: '刘洋', organization: '计算机 2303 班', summary: '结合任务打卡和积分兑换的低碳行为激励系统。', status: 'submitted' },
  { id: 4, competitionId: 3, competitionName: '智能应用原型设计赛', title: 'AI 简历诊断助手', author: '周可', organization: '人工智能 2301 班', summary: '根据岗位要求对简历进行结构化诊断。', status: 'reviewed' }
];

export const tasks = [
  { id: 1, competitionId: 1, competitionName: '2026 校园数字创意作品赛', workId: 1, workTitle: '城市记忆交互影像系统', expertId: 1, expertName: '李明', status: 'pending', deadline: '2026-07-01' },
  { id: 2, competitionId: 1, competitionName: '2026 校园数字创意作品赛', workId: 2, workTitle: '校园导览 AR 小程序', expertId: 1, expertName: '李明', status: 'scored', deadline: '2026-07-01' },
  { id: 3, competitionId: 1, competitionName: '2026 校园数字创意作品赛', workId: 1, workTitle: '城市记忆交互影像系统', expertId: 2, expertName: '王宁', status: 'pending', deadline: '2026-07-01' },
  { id: 4, competitionId: 3, competitionName: '智能应用原型设计赛', workId: 4, workTitle: 'AI 简历诊断助手', expertId: 2, expertName: '王宁', status: 'scored', deadline: '2026-04-20' }
];

export const scores = [
  { id: 1, taskId: 2, innovationScore: 31, practiceScore: 34, presentationScore: 24, totalScore: 89, comment: '作品完成度较高，交互路径清晰，建议补充用户测试数据。' },
  { id: 2, taskId: 4, innovationScore: 30, practiceScore: 32, presentationScore: 23, totalScore: 85, comment: '应用场景明确，算法说明还可以进一步量化。' }
];


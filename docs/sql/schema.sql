DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS review_tasks;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS works;
DROP TABLE IF EXISTS experts;
DROP TABLE IF EXISTS competitions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'expert') NOT NULL,
    display_name VARCHAR(80) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE competitions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(60) NOT NULL,
    status ENUM('draft', 'reviewing', 'finished') NOT NULL DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE experts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(80) NOT NULL,
    title VARCHAR(80),
    specialty VARCHAR(120),
    phone VARCHAR(30),
    email VARCHAR(120),
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE works (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    competition_id BIGINT NOT NULL,
    title VARCHAR(160) NOT NULL,
    author VARCHAR(80) NOT NULL,
    organization VARCHAR(120),
    summary TEXT,
    status ENUM('submitted', 'assigned', 'reviewed') NOT NULL DEFAULT 'submitted',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES competitions(id)
);

CREATE TABLE review_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    competition_id BIGINT NOT NULL,
    work_id BIGINT NOT NULL,
    expert_id BIGINT NOT NULL,
    status ENUM('pending', 'scored') NOT NULL DEFAULT 'pending',
    deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES competitions(id),
    FOREIGN KEY (work_id) REFERENCES works(id),
    FOREIGN KEY (expert_id) REFERENCES experts(id)
);

CREATE TABLE scores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    innovation_score DECIMAL(5,2) NOT NULL,
    practice_score DECIMAL(5,2) NOT NULL,
    presentation_score DECIMAL(5,2) NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES review_tasks(id)
);

CREATE TABLE announcements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    competition_id BIGINT NOT NULL,
    title VARCHAR(120) NOT NULL,
    content TEXT NOT NULL,
    published TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES competitions(id)
);

INSERT INTO users (username, password, role, display_name) VALUES
('admin', '123456', 'admin', '平台管理员'),
('expert01', '123456', 'expert', '李明专家'),
('expert02', '123456', 'expert', '王宁专家');

INSERT INTO competitions (name, category, status, start_date, end_date, description) VALUES
('2026 校园数字创意作品赛', '数字媒体', 'reviewing', '2026-05-01', '2026-07-10', '面向学生的数字创意、交互设计与多媒体作品竞赛。'),
('大学生软件创新挑战赛', '软件开发', 'draft', '2026-06-15', '2026-08-20', '以应用创新、工程质量和演示表现为核心评分指标。'),
('智能应用原型设计赛', '人工智能', 'finished', '2026-03-01', '2026-04-30', '关注 AI 应用场景、产品原型与社会价值。');

INSERT INTO experts (user_id, name, title, specialty, phone, email, enabled) VALUES
(2, '李明', '副教授', '数字媒体设计、交互体验', '13800000001', 'liming@example.com', 1),
(3, '王宁', '高级工程师', '软件工程、人工智能应用', '13800000002', 'wangning@example.com', 1);

INSERT INTO works (competition_id, title, author, organization, summary, status) VALUES
(1, '城市记忆交互影像系统', '张晨', '数字媒体 2301 班', '基于城市老照片与实时交互装置的沉浸式作品。', 'assigned'),
(1, '校园导览 AR 小程序', '陈思雨', '软件 2302 班', '通过 AR 标注教学楼、路线和活动信息。', 'assigned'),
(2, '低碳生活积分平台', '刘洋', '计算机 2303 班', '结合任务打卡和积分兑换的低碳行为激励系统。', 'submitted'),
(3, 'AI 简历诊断助手', '周可', '人工智能 2301 班', '根据岗位要求对简历进行结构化诊断。', 'reviewed');

INSERT INTO review_tasks (competition_id, work_id, expert_id, status, deadline) VALUES
(1, 1, 1, 'pending', '2026-07-01'),
(1, 2, 1, 'scored', '2026-07-01'),
(1, 1, 2, 'pending', '2026-07-01'),
(3, 4, 2, 'scored', '2026-04-20');

INSERT INTO scores (task_id, innovation_score, practice_score, presentation_score, total_score, comment) VALUES
(2, 31, 34, 24, 89, '作品完成度较高，交互路径清晰，建议补充用户测试数据。'),
(4, 30, 32, 23, 85, '应用场景明确，算法说明还可以进一步量化。');

INSERT INTO announcements (competition_id, title, content, published) VALUES
(3, '智能应用原型设计赛结果发布', '本次比赛已完成评审，获奖名单见平台统计结果。', 1);


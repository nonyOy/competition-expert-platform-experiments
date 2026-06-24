<template>
  <section>
    <div class="metric-grid dashboard-metrics">
      <div class="metric-card ink">
        <span>赛事总数</span>
        <strong>{{ overview.totalCompetitions }}</strong>
        <p>覆盖数字媒体、软件开发与 AI 原型</p>
      </div>
      <div class="metric-card green">
        <span>专家数量</span>
        <strong>{{ overview.totalExperts }}</strong>
        <p>审核通过后自动进入专家库</p>
      </div>
      <div class="metric-card amber">
        <span>待评审任务</span>
        <strong>{{ overview.pendingTasks }}</strong>
        <p>需要在截止日期前完成评分</p>
      </div>
      <div class="metric-card rose">
        <span>待审核报名</span>
        <strong>{{ overview.pendingApplications }}</strong>
        <p>来自专家库人选推荐表</p>
      </div>
      <div class="metric-card blue">
        <span>平均分</span>
        <strong>{{ overview.averageScore || 0 }}</strong>
        <p>基于已提交评分实时统计</p>
      </div>
    </div>

    <div class="content-grid">
      <div class="panel wide">
        <div class="panel-title">
          <h2>近期评审任务</h2>
          <el-tag type="warning" effect="plain">进行中</el-tag>
        </div>
        <el-table :data="tasks" stripe>
          <el-table-column prop="workTitle" label="作品" min-width="180" />
          <el-table-column prop="expertName" label="专家" width="120" />
          <el-table-column prop="deadline" label="截止日期" width="140" />
          <el-table-column label="状态" width="110">
            <template #default="{ row }">
              <el-tag :type="row.status === 'scored' ? 'success' : 'warning'">{{ row.status === 'scored' ? '已评分' : '待评审' }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="panel">
        <div class="panel-title">
          <h2>赛事状态</h2>
          <el-button text @click="$router.push('/applications')">处理报名</el-button>
        </div>
        <div class="status-list">
          <div v-for="item in competitions" :key="item.id">
            <span>{{ item.name }}</span>
            <el-tag :type="statusType(item.status)">{{ statusText(item.status) }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchCompetitions, fetchStatistics, fetchTasks, type Competition, type ReviewTask } from '../api/http';

const overview = ref({ totalCompetitions: 0, totalExperts: 0, pendingTasks: 0, averageScore: 0, pendingApplications: 0 });
const tasks = ref<ReviewTask[]>([]);
const competitions = ref<Competition[]>([]);

onMounted(async () => {
  const [stats, taskRows, competitionRows] = await Promise.all([fetchStatistics(), fetchTasks(), fetchCompetitions()]);
  overview.value = { pendingApplications: 0, ...stats.overview };
  tasks.value = taskRows.slice(0, 5);
  competitions.value = competitionRows;
});

function statusText(status: string) {
  return { draft: '筹备中', reviewing: '评审中', finished: '已结束' }[status] || status;
}

function statusType(status: string) {
  return status === 'reviewing' ? 'warning' : status === 'finished' ? 'success' : 'info';
}
</script>


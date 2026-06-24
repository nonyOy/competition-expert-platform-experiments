<template>
  <section>
    <div class="metric-grid compact">
      <div class="metric-card ink"><span>赛事总数</span><strong>{{ overview.totalCompetitions }}</strong></div>
      <div class="metric-card green"><span>专家数量</span><strong>{{ overview.totalExperts }}</strong></div>
      <div class="metric-card amber"><span>待处理</span><strong>{{ overview.pendingTasks }}</strong></div>
      <div class="metric-card rose"><span>平均分</span><strong>{{ overview.averageScore || 0 }}</strong></div>
    </div>

    <div class="panel">
      <div class="panel-title">
        <div>
          <h2>评分排名</h2>
          <p>按已提交评分计算作品平均分。</p>
        </div>
        <el-button type="primary">发布结果</el-button>
      </div>
      <el-table :data="ranking" stripe>
        <el-table-column type="index" label="排名" width="80" />
        <el-table-column prop="workTitle" label="作品" min-width="200" />
        <el-table-column prop="competitionName" label="赛事" min-width="220" />
        <el-table-column prop="scoreCount" label="评分数" width="100" />
        <el-table-column prop="averageScore" label="平均分" width="120" />
      </el-table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchStatistics } from '../api/http';

const overview = ref({ totalCompetitions: 0, totalExperts: 0, pendingTasks: 0, averageScore: 0 });
const ranking = ref([]);

onMounted(async () => {
  const data = await fetchStatistics();
  overview.value = data.overview;
  ranking.value = data.ranking;
});
</script>


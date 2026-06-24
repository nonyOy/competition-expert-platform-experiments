<template>
  <section class="panel">
    <div class="panel-title">
      <div>
        <h2>任务分配</h2>
        <p>展示作品与专家的评审绑定关系。</p>
      </div>
      <el-segmented v-model="status" :options="['全部', '待评审', '已评分']" />
    </div>

    <div class="task-list">
      <article v-for="item in filtered" :key="item.id" class="task-row">
        <div>
          <h3>{{ item.workTitle }}</h3>
          <p>{{ item.competitionName }}</p>
        </div>
        <div>
          <span>评审专家</span>
          <strong>{{ item.expertName }}</strong>
        </div>
        <div>
          <span>截止日期</span>
          <strong>{{ item.deadline }}</strong>
        </div>
        <el-tag :type="item.status === 'scored' ? 'success' : 'warning'">{{ item.status === 'scored' ? '已评分' : '待评审' }}</el-tag>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchTasks, type ReviewTask } from '../api/http';

const tasks = ref<ReviewTask[]>([]);
const status = ref('全部');
const filtered = computed(() => tasks.value.filter((item) => {
  if (status.value === '待评审') return item.status === 'pending';
  if (status.value === '已评分') return item.status === 'scored';
  return true;
}));

onMounted(async () => {
  tasks.value = await fetchTasks();
});
</script>


<template>
  <section class="panel">
    <div class="panel-title">
      <div>
        <h2>作品管理</h2>
        <p>跟踪参赛作品、所属赛事与评审状态。</p>
      </div>
      <el-input v-model="keyword" class="search-input" placeholder="搜索作品或作者" clearable />
    </div>
    <el-table :data="filtered" stripe>
      <el-table-column prop="title" label="作品名称" min-width="190" />
      <el-table-column prop="competitionName" label="所属赛事" min-width="220" />
      <el-table-column prop="author" label="作者" width="100" />
      <el-table-column prop="organization" label="单位" width="150" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'reviewed' ? 'success' : row.status === 'assigned' ? 'warning' : 'info'">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="summary" label="作品摘要" min-width="260" />
    </el-table>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchWorks, type Work } from '../api/http';

const works = ref<Work[]>([]);
const keyword = ref('');
const filtered = computed(() => works.value.filter((item) => `${item.title}${item.author}${item.competitionName}`.includes(keyword.value)));

onMounted(async () => {
  works.value = await fetchWorks();
});

function statusText(status: string) {
  return { submitted: '待分配', assigned: '已分配', reviewed: '已评审' }[status] || status;
}
</script>


<template>
  <section class="panel">
    <div class="panel-title">
      <div>
        <h2>专家管理</h2>
        <p>查看专家专业方向、联系方式与启用状态。</p>
      </div>
      <el-tag type="success">已启用 {{ enabledCount }} 人</el-tag>
    </div>
    <div class="expert-grid">
      <article v-for="item in experts" :key="item.id" class="expert-card">
        <div>
          <h3>{{ item.name }}</h3>
          <el-tag size="small">{{ item.title }}</el-tag>
        </div>
        <p>{{ item.specialty }}</p>
        <span>{{ item.phone }}</span>
        <span>{{ item.email }}</span>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchExperts, type Expert } from '../api/http';

const experts = ref<Expert[]>([]);
const enabledCount = computed(() => experts.value.filter((item) => item.enabled).length);

onMounted(async () => {
  experts.value = await fetchExperts();
});
</script>


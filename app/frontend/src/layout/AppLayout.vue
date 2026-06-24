<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">竞</div>
        <div>
          <strong>竞赛专家平台</strong>
          <span>Review Console</span>
        </div>
      </div>

      <nav>
        <router-link v-for="item in menu" :key="item.path" :to="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <div>
          <p class="eyebrow">Competition Review</p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="user-box">
          <el-tag effect="dark" round>{{ auth.user?.role === 'admin' ? '管理员' : '评审专家' }}</el-tag>
          <span>{{ auth.user?.displayName }}</span>
          <el-button text @click="logout">退出</el-button>
        </div>
      </header>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DataAnalysis, Finished, FolderChecked, Grid, Medal, Tickets, UserFilled } from '@element-plus/icons-vue';
import { useAuthStore } from '../store/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const adminMenu = [
  { path: '/dashboard', label: '数据看板', icon: Grid },
  { path: '/competitions', label: '赛事管理', icon: Medal },
  { path: '/experts', label: '专家管理', icon: UserFilled },
  { path: '/works', label: '作品管理', icon: FolderChecked },
  { path: '/tasks', label: '任务分配', icon: Tickets },
  { path: '/statistics', label: '评分统计', icon: DataAnalysis }
];

const expertMenu = [
  { path: '/review', label: '评审工作台', icon: Finished },
  { path: '/statistics', label: '结果统计', icon: DataAnalysis }
];

const menu = computed(() => (auth.isAdmin ? adminMenu : expertMenu));
const pageTitle = computed(() => menu.value.find((item) => item.path === route.path)?.label || '竞赛专家管理平台');

function logout() {
  auth.signOut();
  router.push('/login');
}
</script>


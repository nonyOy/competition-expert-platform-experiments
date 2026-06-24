<template>
  <section class="login-page">
    <div class="login-hero">
      <p class="eyebrow">Competition Expert App</p>
      <h1>竞赛专家管理平台</h1>
      <p>统一管理赛事、专家、作品与评审任务，让报名审核、评分进度和结果统计形成完整闭环。</p>
      <div class="hero-points">
        <span>专家入库报名</span>
        <span>管理员审核流转</span>
        <span>评审任务追踪</span>
      </div>
    </div>

    <el-form class="login-card" :model="form" @submit.prevent="handleLogin">
      <h2>登录平台</h2>
      <p>管理员：admin / 123456；专家：expert01 / 123456。审核通过的新专家使用手机号 / 123456 登录。</p>
      <el-form-item>
        <el-input v-model="form.username" size="large" placeholder="账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" size="large" type="password" show-password placeholder="密码" />
      </el-form-item>
      <el-button class="login-button" size="large" type="primary" :loading="loading" @click="handleLogin">进入系统</el-button>
      <el-button class="apply-button" size="large" plain @click="router.push('/apply')">专家报名申请</el-button>
    </el-form>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const form = reactive({ username: 'admin', password: '123456' });

async function handleLogin() {
  loading.value = true;
  try {
    const user = await auth.signIn(form.username, form.password);
    ElMessage.success('登录成功');
    router.push(user.role === 'admin' ? '/dashboard' : '/review');
  } catch {
    ElMessage.error('账号或密码错误');
  } finally {
    loading.value = false;
  }
}
</script>


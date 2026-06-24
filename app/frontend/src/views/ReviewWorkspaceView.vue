<template>
  <section class="review-layout">
    <div class="panel task-column">
      <div class="panel-title">
        <div>
          <h2>评审工作台</h2>
          <p>选择任务后填写评分和评语。</p>
        </div>
      </div>
      <button
        v-for="item in tasks"
        :key="item.id"
        class="review-item"
        :class="{ active: current?.id === item.id }"
        type="button"
        @click="current = item"
      >
        <span>{{ item.competitionName }}</span>
        <strong>{{ item.workTitle }}</strong>
        <small>截止 {{ item.deadline }}</small>
        <el-tag :type="item.status === 'scored' ? 'success' : 'warning'" size="small">{{ item.status === 'scored' ? '已评分' : '待评审' }}</el-tag>
      </button>
    </div>

    <div class="panel review-panel" v-if="current">
      <div class="work-header">
        <div>
          <p class="eyebrow">Work Detail</p>
          <h2>{{ current.workTitle }}</h2>
          <span>{{ current.author || '参赛作者' }} · {{ current.organization || '参赛单位' }}</span>
        </div>
        <el-tag size="large">{{ current.status === 'scored' ? '已完成' : '等待评分' }}</el-tag>
      </div>

      <div class="summary-box">
        {{ current.summary || '该作品暂无更多摘要，评审时可结合附件、演示视频和现场答辩进行综合判断。' }}
      </div>

      <el-form class="score-form" label-position="top">
        <el-form-item label="创新性评分（满分 35）">
          <el-slider v-model="form.innovationScore" :max="35" show-input />
        </el-form-item>
        <el-form-item label="实践性评分（满分 40）">
          <el-slider v-model="form.practiceScore" :max="40" show-input />
        </el-form-item>
        <el-form-item label="展示表达评分（满分 25）">
          <el-slider v-model="form.presentationScore" :max="25" show-input />
        </el-form-item>
        <div class="total-line">
          <span>综合得分</span>
          <strong>{{ total }}</strong>
        </div>
        <el-form-item label="评审意见">
          <el-input v-model="form.comment" type="textarea" :rows="4" placeholder="请输入作品优点、问题和改进建议" />
        </el-form-item>
        <el-button type="primary" size="large" :disabled="current.status === 'scored'" @click="submit">提交评分</el-button>
      </el-form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { fetchTasks, submitScore, type ReviewTask } from '../api/http';
import { useAuthStore } from '../store/auth';

const auth = useAuthStore();
const tasks = ref<ReviewTask[]>([]);
const current = ref<ReviewTask | null>(null);
const form = reactive({
  innovationScore: 28,
  practiceScore: 32,
  presentationScore: 20,
  comment: ''
});

const total = computed(() => form.innovationScore + form.practiceScore + form.presentationScore);

onMounted(async () => {
  tasks.value = await fetchTasks(auth.user?.expertId);
  current.value = tasks.value[0] || null;
});

watch(current, () => {
  form.innovationScore = 28;
  form.practiceScore = 32;
  form.presentationScore = 20;
  form.comment = current.value?.comment || '';
});

async function submit() {
  if (!current.value) return;
  await submitScore({ taskId: current.value.id, ...form });
  ElMessage.success('评分已提交');
  current.value.status = 'scored';
}
</script>


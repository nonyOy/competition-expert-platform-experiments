<template>
  <section class="panel">
    <div class="panel-title">
      <div>
        <h2>赛事管理</h2>
        <p>维护竞赛基础信息和评审阶段。</p>
      </div>
      <el-button type="primary" @click="dialogVisible = true">新增赛事</el-button>
    </div>

    <div class="toolbar">
      <el-input v-model="keyword" placeholder="搜索赛事名称或类别" clearable />
    </div>

    <el-table :data="filtered" stripe>
      <el-table-column prop="name" label="赛事名称" min-width="220" />
      <el-table-column prop="category" label="类别" width="120" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'reviewing' ? 'warning' : row.status === 'finished' ? 'success' : 'info'">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始日期" width="130" />
      <el-table-column prop="endDate" label="结束日期" width="130" />
      <el-table-column prop="description" label="说明" min-width="240" />
    </el-table>

    <el-dialog v-model="dialogVisible" title="新增赛事" width="520px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="类别"><el-input v-model="form.category" /></el-form-item>
        <el-form-item label="开始"><el-date-picker v-model="form.startDate" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="结束"><el-date-picker v-model="form.endDate" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="form.description" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { createCompetition, fetchCompetitions, type Competition } from '../api/http';

const rows = ref<Competition[]>([]);
const keyword = ref('');
const dialogVisible = ref(false);
const form = reactive({ name: '', category: '', startDate: '', endDate: '', description: '' });

const filtered = computed(() => rows.value.filter((item) => `${item.name}${item.category}`.includes(keyword.value)));

onMounted(load);

async function load() {
  rows.value = await fetchCompetitions();
}

async function save() {
  await createCompetition(form);
  ElMessage.success('赛事已创建');
  dialogVisible.value = false;
  await load();
}

function statusText(status: string) {
  return { draft: '筹备中', reviewing: '评审中', finished: '已结束' }[status] || status;
}
</script>


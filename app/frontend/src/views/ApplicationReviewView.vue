<template>
  <section class="review-admin">
    <div class="panel">
      <div class="panel-title">
        <div>
          <h2>专家报名审核</h2>
          <p>审核通过后，申请人会进入专家库，并生成手机号登录账号。</p>
        </div>
        <el-segmented v-model="statusFilter" :options="filterOptions" @change="loadList" />
      </div>

      <el-table :data="applications" stripe @row-click="openDetail">
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="track" label="申请赛道" min-width="180" />
        <el-table-column prop="majorCategory" label="专业大类" min-width="160" />
        <el-table-column prop="workplace" label="工作单位" min-width="190" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="170" />
      </el-table>
    </div>

    <el-drawer v-model="drawerVisible" size="58%" title="报名表详情">
      <template v-if="detail">
        <div class="application-detail">
          <div class="detail-head">
            <div>
              <p class="eyebrow">Application Detail</p>
              <h2>{{ detail.name }} · {{ detail.track }}</h2>
              <span>{{ detail.workplace }} / {{ detail.specialtyDirection }}</span>
            </div>
            <el-tag size="large" :type="statusType(detail.status)">{{ statusText(detail.status) }}</el-tag>
          </div>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="专业大类">{{ detail.majorCategory }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ detail.gender }}</el-descriptions-item>
            <el-descriptions-item label="民族">{{ detail.ethnicity }}</el-descriptions-item>
            <el-descriptions-item label="出生年月">{{ detail.birthMonth }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ detail.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ detail.email }}</el-descriptions-item>
            <el-descriptions-item label="政治面貌">{{ detail.politicsStatus }}</el-descriptions-item>
            <el-descriptions-item label="学历/学位">{{ detail.educationDegree }}</el-descriptions-item>
            <el-descriptions-item label="身体状况">{{ detail.healthStatus }}</el-descriptions-item>
            <el-descriptions-item label="工作年限">{{ detail.workYears }}</el-descriptions-item>
            <el-descriptions-item label="职务">{{ detail.position }}</el-descriptions-item>
            <el-descriptions-item label="职称资格">{{ detail.titleQualification }}</el-descriptions-item>
            <el-descriptions-item label="身份证">{{ detail.idCard }}</el-descriptions-item>
          </el-descriptions>

          <section class="detail-section">
            <h3>近五年参与技能竞赛专家活动情况</h3>
            <el-table :data="detail.activities" size="small" border>
              <el-table-column prop="year" label="年份" width="100" />
              <el-table-column prop="eventName" label="赛项/赛道名称" />
              <el-table-column prop="competitionLevel" label="竞赛类别" width="120" />
              <el-table-column prop="duty" label="担任职务" width="140" />
            </el-table>
          </section>

          <section class="detail-section">
            <h3>表彰或荣誉称号</h3>
            <div class="honor-tags">
              <el-tag v-for="item in detail.honors" :key="item.id || item.honorName" effect="plain">{{ item.honorName }}</el-tag>
              <span v-if="!detail.honors.length" class="muted">暂无填写</span>
            </div>
          </section>

          <section class="detail-section opinion-view">
            <h3>推荐意见</h3>
            <p><strong>单位意见：</strong>{{ detail.unitOpinion || '未填写' }}</p>
            <p><strong>专业（学科）意见：</strong>{{ detail.instituteOpinion || '未填写' }}</p>
            <p><strong>分管部门意见：</strong>{{ detail.departmentOpinion || '未填写' }}</p>
            <p><strong>教育研究院意见：</strong>{{ detail.finalOpinion || '未填写' }}</p>
          </section>

          <section class="detail-section" v-if="detail.status === 'pending'">
            <h3>管理员审核</h3>
            <el-input v-model="reviewOpinion" type="textarea" :rows="3" placeholder="填写审核意见，例如：材料完整，同意入库。" />
            <div class="drawer-actions">
              <el-button type="danger" plain :loading="reviewing" @click="review('rejected')">驳回</el-button>
              <el-button type="primary" :loading="reviewing" @click="review('approved')">通过并加入专家库</el-button>
            </div>
          </section>

          <section v-else class="detail-section opinion-view">
            <h3>审核结果</h3>
            <p>{{ detail.reviewOpinion || '无审核意见' }}</p>
          </section>
        </div>
      </template>
    </el-drawer>
  </section>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import {
  fetchExpertApplication,
  fetchExpertApplications,
  reviewExpertApplication,
  type ApplicationStatus,
  type ExpertApplication
} from '../api/http';

const filterOptions = [
  { label: '全部', value: '' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已驳回', value: 'rejected' }
];

const statusFilter = ref('');
const applications = ref<ExpertApplication[]>([]);
const detail = ref<ExpertApplication | null>(null);
const drawerVisible = ref(false);
const reviewOpinion = ref('');
const reviewing = ref(false);

onMounted(loadList);

async function loadList() {
  applications.value = await fetchExpertApplications(statusFilter.value as ApplicationStatus | undefined);
}

async function openDetail(row: ExpertApplication) {
  if (!row.id) return;
  detail.value = await fetchExpertApplication(row.id);
  reviewOpinion.value = detail.value.reviewOpinion || '';
  drawerVisible.value = true;
}

async function review(status: Exclude<ApplicationStatus, 'pending'>) {
  if (!detail.value?.id) return;
  reviewing.value = true;
  try {
    await reviewExpertApplication(detail.value.id, status, reviewOpinion.value);
    ElMessage.success(status === 'approved' ? '已通过申请，专家已入库' : '已驳回申请');
    await loadList();
    detail.value = await fetchExpertApplication(detail.value.id);
  } finally {
    reviewing.value = false;
  }
}

function statusText(status?: string) {
  return { pending: '待审核', approved: '已通过', rejected: '已驳回' }[status || ''] || status || '未知';
}

function statusType(status?: string) {
  return status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning';
}
</script>


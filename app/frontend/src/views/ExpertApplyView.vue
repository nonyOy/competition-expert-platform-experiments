<template>
  <section class="apply-page">
    <header class="apply-hero">
      <el-button text @click="router.push('/login')">返回登录</el-button>
      <p class="eyebrow">Expert Application</p>
      <h1>西红市职业院校技能大赛专家库人选推荐表</h1>
      <p>请按推荐表内容填写信息，提交后由管理员审核。审核通过后会自动进入专家库，账号为手机号，默认密码为 123456。</p>
    </header>

    <el-form ref="formRef" class="apply-form" :model="form" :rules="rules" label-position="top">
      <section class="form-section">
        <div class="section-head">
          <span>01</span>
          <div>
            <h2>申报方向</h2>
            <p>用于匹配后续赛事评审任务。</p>
          </div>
        </div>
        <div class="form-grid two">
          <el-form-item label="申请赛道" prop="track"><el-input v-model="form.track" /></el-form-item>
          <el-form-item label="专业大类" prop="majorCategory"><el-input v-model="form.majorCategory" /></el-form-item>
        </div>
      </section>

      <section class="form-section">
        <div class="section-head">
          <span>02</span>
          <div>
            <h2>基础信息</h2>
            <p>请保证身份、联系方式与工作信息准确。</p>
          </div>
        </div>
        <div class="form-grid four">
          <el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item>
          <el-form-item label="性别" prop="gender"><el-select v-model="form.gender"><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select></el-form-item>
          <el-form-item label="民族" prop="ethnicity"><el-input v-model="form.ethnicity" /></el-form-item>
          <el-form-item label="出生年月" prop="birthMonth"><el-date-picker v-model="form.birthMonth" type="month" value-format="YYYY-MM" /></el-form-item>
          <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" /></el-form-item>
          <el-form-item label="政治面貌" prop="politicsStatus"><el-input v-model="form.politicsStatus" /></el-form-item>
          <el-form-item label="学历/学位" prop="educationDegree"><el-input v-model="form.educationDegree" /></el-form-item>
          <el-form-item label="身体状况" prop="healthStatus"><el-input v-model="form.healthStatus" /></el-form-item>
          <el-form-item label="电子邮箱" prop="email"><el-input v-model="form.email" /></el-form-item>
          <el-form-item label="身份证" prop="idCard"><el-input v-model="form.idCard" /></el-form-item>
        </div>
      </section>

      <section class="form-section">
        <div class="section-head">
          <span>03</span>
          <div>
            <h2>单位与专业能力</h2>
            <p>这些信息会在审核通过后同步进入专家库。</p>
          </div>
        </div>
        <div class="form-grid two">
          <el-form-item label="工作单位" prop="workplace"><el-input v-model="form.workplace" /></el-form-item>
          <el-form-item label="工作年限" prop="workYears"><el-input-number v-model="form.workYears" :min="0" :max="60" /></el-form-item>
          <el-form-item label="职务" prop="position"><el-input v-model="form.position" /></el-form-item>
          <el-form-item label="职称（职业资格等级）" prop="titleQualification"><el-input v-model="form.titleQualification" /></el-form-item>
        </div>
        <el-form-item label="擅长专业方向" prop="specialtyDirection">
          <el-input v-model="form.specialtyDirection" type="textarea" :rows="3" placeholder="例如：软件测试、Web 前端开发、数字媒体交互设计" />
        </el-form-item>
      </section>

      <section class="form-section">
        <div class="section-head">
          <span>04</span>
          <div>
            <h2>近五年竞赛专家活动</h2>
            <p>可填写市赛、省赛、国赛中的评审、裁判、命题等经历。</p>
          </div>
          <el-button @click="addActivity">新增经历</el-button>
        </div>
        <div class="activity-table">
          <div v-for="(item, index) in form.activities" :key="index" class="activity-row">
            <el-input v-model="item.year" placeholder="年份" />
            <el-input v-model="item.eventName" placeholder="赛项/赛道名称" />
            <el-select v-model="item.competitionLevel" placeholder="竞赛类别">
              <el-option label="市赛" value="市赛" />
              <el-option label="省赛" value="省赛" />
              <el-option label="国赛" value="国赛" />
            </el-select>
            <el-input v-model="item.duty" placeholder="担任职务" />
            <el-button text type="danger" @click="removeActivity(index)">删除</el-button>
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-head">
          <span>05</span>
          <div>
            <h2>荣誉与推荐意见</h2>
            <p>荣誉最多填写 3 项，意见字段用于保留原始推荐表信息。</p>
          </div>
        </div>
        <div class="honor-list">
          <div v-for="(item, index) in form.honors" :key="index" class="honor-row">
            <el-input v-model="item.honorName" :placeholder="`荣誉称号 ${index + 1}`" />
            <el-button text type="danger" @click="removeHonor(index)">删除</el-button>
          </div>
          <el-button :disabled="form.honors.length >= 3" @click="addHonor">新增荣誉</el-button>
        </div>
        <div class="form-grid two opinion-grid">
          <el-form-item label="专家所在单位意见"><el-input v-model="form.unitOpinion" type="textarea" :rows="3" /></el-form-item>
          <el-form-item label="教育研究院专业（学科）意见"><el-input v-model="form.instituteOpinion" type="textarea" :rows="3" /></el-form-item>
          <el-form-item label="分管部门意见"><el-input v-model="form.departmentOpinion" type="textarea" :rows="3" /></el-form-item>
          <el-form-item label="教育研究院意见"><el-input v-model="form.finalOpinion" type="textarea" :rows="3" /></el-form-item>
        </div>
      </section>

      <div class="apply-actions">
        <el-button size="large" @click="router.push('/login')">取消</el-button>
        <el-button size="large" type="primary" :loading="loading" @click="submit">提交报名申请</el-button>
      </div>
    </el-form>
  </section>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { submitExpertApplication, type ExpertApplication } from '../api/http';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive<ExpertApplication>({
  track: '信息技术应用创新',
  majorCategory: '电子与信息大类',
  name: '',
  gender: '男',
  ethnicity: '汉族',
  birthMonth: '',
  phone: '',
  politicsStatus: '',
  educationDegree: '',
  healthStatus: '良好',
  email: '',
  workplace: '',
  workYears: 0,
  position: '',
  specialtyDirection: '',
  titleQualification: '',
  idCard: '',
  unitOpinion: '',
  instituteOpinion: '',
  departmentOpinion: '',
  finalOpinion: '',
  activities: [{ year: '', eventName: '', competitionLevel: '市赛', duty: '' }],
  honors: [{ honorName: '' }]
});

const required = { required: true, message: '请填写该项', trigger: 'blur' };
const rules: FormRules = {
  track: [required],
  majorCategory: [required],
  name: [required],
  phone: [required],
  email: [required],
  workplace: [required],
  specialtyDirection: [required],
  titleQualification: [required],
  idCard: [required]
};

function addActivity() {
  form.activities.push({ year: '', eventName: '', competitionLevel: '市赛', duty: '' });
}

function removeActivity(index: number) {
  form.activities.splice(index, 1);
}

function addHonor() {
  if (form.honors.length < 3) {
    form.honors.push({ honorName: '' });
  }
}

function removeHonor(index: number) {
  form.honors.splice(index, 1);
}

async function submit() {
  await formRef.value?.validate();
  loading.value = true;
  try {
    await submitExpertApplication({
      ...form,
      activities: form.activities.filter((item) => item.year || item.eventName || item.duty),
      honors: form.honors.filter((item) => item.honorName)
    });
    ElMessage.success('报名申请已提交，请等待管理员审核');
    router.push('/login');
  } finally {
    loading.value = false;
  }
}
</script>


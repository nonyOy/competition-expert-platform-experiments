import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const publicPaths = ['/login', '/apply'];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/apply', name: 'apply', component: () => import('../views/ExpertApplyView.vue') },
    {
      path: '/',
      component: () => import('../layout/AppLayout.vue'),
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', component: () => import('../views/DashboardView.vue') },
        { path: 'competitions', component: () => import('../views/CompetitionView.vue') },
        { path: 'experts', component: () => import('../views/ExpertView.vue') },
        { path: 'applications', component: () => import('../views/ApplicationReviewView.vue') },
        { path: 'works', component: () => import('../views/WorkView.vue') },
        { path: 'tasks', component: () => import('../views/TaskView.vue') },
        { path: 'review', component: () => import('../views/ReviewWorkspaceView.vue') },
        { path: 'statistics', component: () => import('../views/StatisticsView.vue') }
      ]
    }
  ]
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!publicPaths.includes(to.path) && !auth.isLoggedIn) {
    return '/login';
  }
  if (to.path === '/login' && auth.isLoggedIn) {
    return auth.isAdmin ? '/dashboard' : '/review';
  }
  return true;
});

export default router;


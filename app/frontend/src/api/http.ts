import axios from 'axios';

export const http = axios.create({
  baseURL: '/api',
  timeout: 8000
});

export interface UserInfo {
  id: number;
  username: string;
  role: 'admin' | 'expert';
  displayName: string;
  expertId?: number;
}

export interface Competition {
  id: number;
  name: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Expert {
  id: number;
  name: string;
  title: string;
  specialty: string;
  phone: string;
  email: string;
  enabled: boolean;
}

export interface Work {
  id: number;
  competitionId: number;
  competitionName: string;
  title: string;
  author: string;
  organization: string;
  summary: string;
  status: string;
}

export interface ReviewTask extends Partial<Work> {
  id: number;
  competitionName: string;
  workId: number;
  workTitle: string;
  expertId: number;
  expertName: string;
  status: string;
  deadline: string;
  totalScore?: number;
  comment?: string;
}

export async function login(username: string, password: string) {
  const { data } = await http.post<UserInfo>('/auth/login', { username, password });
  return data;
}

export async function fetchCompetitions() {
  const { data } = await http.get<Competition[]>('/competitions');
  return data;
}

export async function createCompetition(payload: Partial<Competition>) {
  const { data } = await http.post('/competitions', payload);
  return data;
}

export async function fetchExperts() {
  const { data } = await http.get<Expert[]>('/experts');
  return data;
}

export async function fetchWorks() {
  const { data } = await http.get<Work[]>('/works');
  return data;
}

export async function fetchTasks(expertId?: number) {
  const { data } = await http.get<ReviewTask[]>('/review-tasks', { params: { expertId } });
  return data;
}

export async function submitScore(payload: {
  taskId: number;
  innovationScore: number;
  practiceScore: number;
  presentationScore: number;
  comment: string;
}) {
  const { data } = await http.post('/scores', payload);
  return data;
}

export async function fetchStatistics() {
  const { data } = await http.get('/statistics');
  return data;
}


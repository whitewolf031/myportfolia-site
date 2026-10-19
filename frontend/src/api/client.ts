import { AuthResponse, ContactMessage, PortfolioData, Profile, Project, Service, Skill, SkillGroup, Stat, Testimonial, TimelineItem } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = getAccessToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set application/json if body is not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response = await fetch(url, { ...options, headers });

  // Handle token refresh on 401
  if (response.status === 401 && token) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem('access_token', data.access);
          headers['Authorization'] = `Bearer ${data.access}`;
          response = await fetch(url, { ...options, headers });
        } else {
          clearTokens();
          window.location.href = '/admin/login';
        }
      } catch {
        clearTokens();
        window.location.href = '/admin/login';
      }
    }
  }

  if (!response.ok) {
    let errDetail = 'Xatolik yuz berdi';
    try {
      const errJson = await response.json();
      if (typeof errJson === 'object' && errJson !== null) {
        errDetail = Object.entries(errJson)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
          .join('\n');
      }
    } catch {
      errDetail = response.statusText;
    }
    throw new Error(errDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Public endpoints
export async function getPortfolio(): Promise<PortfolioData> {
  return request<PortfolioData>('/portfolio/');
}

export async function submitContact(data: { name: string; contact: string; message: string; website?: string }): Promise<{ status: string; message: string }> {
  return request<{ status: string; message: string }>('/contact/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Auth
export async function login(credentials: { username: string; password: string }): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  setTokens(data.access, data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  clearTokens();
}

// Admin Profile
export async function adminGetProfile(): Promise<Profile> {
  return request<Profile>('/admin/profile/');
}

export async function adminUpdateProfile(formData: FormData): Promise<Profile> {
  return request<Profile>('/admin/profile/', {
    method: 'PATCH',
    body: formData,
  });
}

// Admin Projects
export async function adminGetProjects(): Promise<Project[]> {
  return request<Project[]>('/admin/projects/');
}

export async function adminCreateProject(formData: FormData): Promise<Project> {
  return request<Project>('/admin/projects/', {
    method: 'POST',
    body: formData,
  });
}

export async function adminUpdateProject(id: number, formData: FormData): Promise<Project> {
  return request<Project>(`/admin/projects/${id}/`, {
    method: 'PATCH',
    body: formData,
  });
}

export async function adminDeleteProject(id: number): Promise<void> {
  return request<void>(`/admin/projects/${id}/`, {
    method: 'DELETE',
  });
}

export async function adminReorderProjects(ids: number[]): Promise<void> {
  return request<void>('/admin/projects/reorder/', {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  });
}

// Admin Stats
export async function adminGetStats(): Promise<Stat[]> {
  return request<Stat[]>('/admin/stats/');
}

export async function adminCreateStat(data: Partial<Stat>): Promise<Stat> {
  return request<Stat>('/admin/stats/', { method: 'POST', body: JSON.stringify(data) });
}

export async function adminUpdateStat(id: number, data: Partial<Stat>): Promise<Stat> {
  return request<Stat>(`/admin/stats/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function adminDeleteStat(id: number): Promise<void> {
  return request<void>(`/admin/stats/${id}/`, { method: 'DELETE' });
}

export async function adminReorderStats(ids: number[]): Promise<void> {
  return request<void>('/admin/stats/reorder/', { method: 'PATCH', body: JSON.stringify({ ids }) });
}

// Admin Skills
export async function adminGetSkillGroups(): Promise<SkillGroup[]> {
  return request<SkillGroup[]>('/admin/skill-groups/');
}

export async function adminCreateSkillGroup(data: { name: string; order?: number; visible?: boolean }): Promise<SkillGroup> {
  return request<SkillGroup>('/admin/skill-groups/', { method: 'POST', body: JSON.stringify(data) });
}

export async function adminUpdateSkillGroup(id: number, data: Partial<SkillGroup>): Promise<SkillGroup> {
  return request<SkillGroup>(`/admin/skill-groups/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function adminDeleteSkillGroup(id: number): Promise<void> {
  return request<void>(`/admin/skill-groups/${id}/`, { method: 'DELETE' });
}

export async function adminCreateSkill(data: { group: number; name: string; order?: number; visible?: boolean }): Promise<Skill> {
  return request<Skill>('/admin/skills/', { method: 'POST', body: JSON.stringify(data) });
}

export async function adminDeleteSkill(id: number): Promise<void> {
  return request<void>(`/admin/skills/${id}/`, { method: 'DELETE' });
}

// Admin Services
export async function adminGetServices(): Promise<Service[]> {
  return request<Service[]>('/admin/services/');
}

export async function adminCreateService(data: Partial<Service>): Promise<Service> {
  return request<Service>('/admin/services/', { method: 'POST', body: JSON.stringify(data) });
}

export async function adminUpdateService(id: number, data: Partial<Service>): Promise<Service> {
  return request<Service>(`/admin/services/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function adminDeleteService(id: number): Promise<void> {
  return request<void>(`/admin/services/${id}/`, { method: 'DELETE' });
}

// Admin Timeline
export async function adminGetTimeline(): Promise<TimelineItem[]> {
  return request<TimelineItem[]>('/admin/timeline/');
}

export async function adminCreateTimeline(data: Partial<TimelineItem>): Promise<TimelineItem> {
  return request<TimelineItem>('/admin/timeline/', { method: 'POST', body: JSON.stringify(data) });
}

export async function adminUpdateTimeline(id: number, data: Partial<TimelineItem>): Promise<TimelineItem> {
  return request<TimelineItem>(`/admin/timeline/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function adminDeleteTimeline(id: number): Promise<void> {
  return request<void>(`/admin/timeline/${id}/`, { method: 'DELETE' });
}

// Admin Testimonials
export async function adminGetTestimonials(): Promise<Testimonial[]> {
  return request<Testimonial[]>('/admin/testimonials/');
}

export async function adminCreateTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
  return request<Testimonial>('/admin/testimonials/', { method: 'POST', body: JSON.stringify(data) });
}

export async function adminUpdateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial> {
  return request<Testimonial>(`/admin/testimonials/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function adminDeleteTestimonial(id: number): Promise<void> {
  return request<void>(`/admin/testimonials/${id}/`, { method: 'DELETE' });
}

// Admin Messages
export async function adminGetMessages(): Promise<ContactMessage[]> {
  return request<ContactMessage[]>('/contact/admin/messages/');
}

export async function adminUpdateMessage(id: number, data: { is_read: boolean }): Promise<ContactMessage> {
  return request<ContactMessage>(`/contact/admin/messages/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function adminDeleteMessage(id: number): Promise<void> {
  return request<void>(`/contact/admin/messages/${id}/`, { method: 'DELETE' });
}

export async function adminResendMessage(id: number): Promise<{ status: string; message: string }> {
  return request<{ status: string; message: string }>(`/contact/admin/messages/${id}/resend/`, { method: 'POST' });
}

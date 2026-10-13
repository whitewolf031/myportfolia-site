export interface Profile {
  id: number;
  full_name: string;
  headline: string;
  short_bio: string;
  photo: string | null;
  resume: string | null;
  open_to_work: boolean;
  email: string;
  telegram_username: string;
  github_url: string;
  linkedin_url: string;
  updated_at: string;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
  order: number;
  visible: boolean;
}

export interface Skill {
  id: number;
  group: number;
  name: string;
  order: number;
  visible: boolean;
}

export interface SkillGroup {
  id: number;
  name: string;
  order: number;
  visible: boolean;
  skills: Skill[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  order: number;
  visible: boolean;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  technologies: string;
  image: string | null;
  link_url: string;
  repo_url: string;
  visible: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineItem {
  id: number;
  kind: 'experience' | 'education';
  title: string;
  organization: string;
  start: string;
  end: string | null;
  description: string;
  order: number;
  visible: boolean;
}

export interface Testimonial {
  id: number;
  author: string;
  role_company: string;
  quote: string;
  order: number;
  visible: boolean;
}

export interface PortfolioData {
  profile: Profile;
  stats: Stat[];
  skill_groups: SkillGroup[];
  services: Service[];
  projects: Project[];
  timeline: TimelineItem[];
  testimonials: Testimonial[];
}

export interface ContactMessage {
  id: number;
  name: string;
  contact: string;
  message: string;
  ip_hash: string;
  created_at: string;
  is_read: boolean;
  telegram_status: 'pending' | 'sent' | 'failed';
  error_message: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

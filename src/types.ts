export interface Project {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  summary: string;
  image: string;
  badge?: string;
  techStack: string[];
  metrics: { label: string; value: string }[];
  problem: string;
  solution: string;
  architecture: string[];
  codeSnippet?: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    experience: string;
    focus: string;
  }[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface LeadInquiry {
  name: string;
  email: string;
  budget: string;
  timeline: string;
  message: string;
}

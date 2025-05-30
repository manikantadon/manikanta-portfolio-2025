import { IUser } from "./models/User";
import {
  IProject,
  ISkill,
  IExperience,
  IPortfolioProfile,
} from "./models/Portfolio";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: Omit<IUser, "passwordHash">;
}

// Portfolio Types
export interface ProjectFormData {
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface SkillFormData {
  name: string;
  category: string;
  level: number;
}

export interface ExperienceFormData {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
}

export interface PortfolioProfileFormData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  profileImage?: string;
  resumeUrl?: string;
  isPublic: boolean;
  theme: string;
}

export interface PortfolioData {
  profile: IPortfolioProfile;
  projects: IProject[];
  skills: ISkill[];
  experiences: IExperience[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

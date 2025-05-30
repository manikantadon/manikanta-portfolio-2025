import mongoose, { Document, Schema } from 'mongoose';

// Project Model
export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    technologies: [{
      type: String,
      trim: true,
    }],
    imageUrl: {
      type: String,
      trim: true,
    },
    projectUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Skill Model
export interface ISkill extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  level: number; // 1-5 scale
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Experience Model
export interface IExperience extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  location?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Portfolio Profile Model
export interface IPortfolioProfile extends Document {
  userId: mongoose.Types.ObjectId;
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
  customDomain?: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioProfileSchema = new Schema<IPortfolioProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    customDomain: {
      type: String,
      trim: true,
    },
    theme: {
      type: String,
      default: 'modern',
      enum: ['modern', 'classic', 'minimal', 'creative'],
    },
  },
  {
    timestamps: true,
  }
);

// Export models
export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const Skill = mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
export const Experience = mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
export const PortfolioProfile = mongoose.models.PortfolioProfile || mongoose.model<IPortfolioProfile>('PortfolioProfile', PortfolioProfileSchema);

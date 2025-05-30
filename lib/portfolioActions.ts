"use server";

import { getSession } from "./auth";
import dbConnect from "./db";
import {
  Project,
  Skill,
  Experience,
  PortfolioProfile,
} from "./models/Portfolio";
import {
  ProjectFormData,
  SkillFormData,
  ExperienceFormData,
  PortfolioProfileFormData,
  ApiResponse,
} from "./types";

// Portfolio Profile Actions
export async function createOrUpdateProfile(
  data: PortfolioProfileFormData
): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const profileData = {
      ...data,
      userId: user._id,
    };

    const profile = await PortfolioProfile.findOneAndUpdate(
      { userId: user._id },
      profileData,
      { upsert: true, new: true }
    );

    return { success: true, data: JSON.parse(JSON.stringify(profile)) };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
}

export async function getProfile(): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const profile = await PortfolioProfile.findOne({ userId: user._id });

    return {
      success: true,
      data: profile ? JSON.parse(JSON.stringify(profile)) : null,
    };
  } catch (error: any) {
    console.error("Get profile error:", error);
    return {
      success: false,
      message: error.message || "Failed to get profile",
    };
  }
}

// Project Actions
export async function createProject(
  data: ProjectFormData
): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const project = new Project({
      ...data,
      userId: user._id,
    });

    await project.save();

    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    console.error("Create project error:", error);
    return {
      success: false,
      message: error.message || "Failed to create project",
    };
  }
}

export async function updateProject(
  id: string,
  data: ProjectFormData
): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const project = await Project.findOneAndUpdate(
      { _id: id, userId: user._id },
      data,
      { new: true }
    );

    if (!project) {
      return { success: false, message: "Project not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    console.error("Update project error:", error);
    return {
      success: false,
      message: error.message || "Failed to update project",
    };
  }
}

export async function deleteProject(id: string): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const project = await Project.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!project) {
      return { success: false, message: "Project not found" };
    }

    return { success: true, message: "Project deleted successfully" };
  } catch (error: any) {
    console.error("Delete project error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete project",
    };
  }
}

export async function getProjects(): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const projects = await Project.find({ userId: user._id }).sort({
      order: 1,
      createdAt: -1,
    });

    return { success: true, data: JSON.parse(JSON.stringify(projects)) };
  } catch (error: any) {
    console.error("Get projects error:", error);
    return {
      success: false,
      message: error.message || "Failed to get projects",
    };
  }
}

// Skill Actions
export async function createSkill(data: SkillFormData): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const skill = new Skill({
      ...data,
      userId: user._id,
    });

    await skill.save();

    return { success: true, data: JSON.parse(JSON.stringify(skill)) };
  } catch (error: any) {
    console.error("Create skill error:", error);
    return {
      success: false,
      message: error.message || "Failed to create skill",
    };
  }
}

export async function updateSkill(
  id: string,
  data: SkillFormData
): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const skill = await Skill.findOneAndUpdate(
      { _id: id, userId: user._id },
      data,
      { new: true }
    );

    if (!skill) {
      return { success: false, message: "Skill not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(skill)) };
  } catch (error: any) {
    console.error("Update skill error:", error);
    return {
      success: false,
      message: error.message || "Failed to update skill",
    };
  }
}

export async function deleteSkill(id: string): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const skill = await Skill.findOneAndDelete({ _id: id, userId: user._id });

    if (!skill) {
      return { success: false, message: "Skill not found" };
    }

    return { success: true, message: "Skill deleted successfully" };
  } catch (error: any) {
    console.error("Delete skill error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete skill",
    };
  }
}

export async function getSkills(): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const skills = await Skill.find({ userId: user._id }).sort({
      category: 1,
      order: 1,
    });

    return { success: true, data: JSON.parse(JSON.stringify(skills)) };
  } catch (error: any) {
    console.error("Get skills error:", error);
    return { success: false, message: error.message || "Failed to get skills" };
  }
}

// Experience Actions
export async function createExperience(
  data: ExperienceFormData
): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const experience = new Experience({
      ...data,
      userId: user._id,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    });

    await experience.save();

    return { success: true, data: JSON.parse(JSON.stringify(experience)) };
  } catch (error: any) {
    console.error("Create experience error:", error);
    return {
      success: false,
      message: error.message || "Failed to create experience",
    };
  }
}

export async function updateExperience(
  id: string,
  data: ExperienceFormData
): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const updateData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    };

    const experience = await Experience.findOneAndUpdate(
      { _id: id, userId: user._id },
      updateData,
      { new: true }
    );

    if (!experience) {
      return { success: false, message: "Experience not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(experience)) };
  } catch (error: any) {
    console.error("Update experience error:", error);
    return {
      success: false,
      message: error.message || "Failed to update experience",
    };
  }
}

export async function deleteExperience(id: string): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const experience = await Experience.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!experience) {
      return { success: false, message: "Experience not found" };
    }

    return { success: true, message: "Experience deleted successfully" };
  } catch (error: any) {
    console.error("Delete experience error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete experience",
    };
  }
}

export async function getExperiences(): Promise<ApiResponse> {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    await dbConnect();

    const experiences = await Experience.find({ userId: user._id }).sort({
      startDate: -1,
    });

    return { success: true, data: JSON.parse(JSON.stringify(experiences)) };
  } catch (error: any) {
    console.error("Get experiences error:", error);
    return {
      success: false,
      message: error.message || "Failed to get experiences",
    };
  }
}

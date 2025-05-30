"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../lib/portfolioActions";
import { ProjectFormData } from "../../../lib/types";
import { IProject } from "../../../lib/models/Portfolio";
import toast from "react-hot-toast";

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  ExclamationCircleIcon,
  FolderOpenIcon,
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon, // For form update button
  XMarkIcon, // For form cancel button
} from "@heroicons/react/20/solid";

import { FaGithub } from "react-icons/fa";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // State for delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    longDescription: "",
    technologies: [],
    imageUrl: "",
    projectUrl: "",
    githubUrl: "",
    featured: false,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true); // Ensure loading is true when starting
      const result = await getProjects();
      if (result.success) {
        setProjects(result.data || []);
      } else {
        setError(result.message || "Failed to load projects.");
        toast.error(result.message || "Failed to load projects.");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("An unexpected error occurred while loading projects.");
      toast.error("An unexpected error occurred while loading projects.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      technologies: [],
      imageUrl: "",
      projectUrl: "",
      githubUrl: "",
      featured: false,
    });
    setEditingProject(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (project: IProject) => {
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      technologies: project.technologies,
      imageUrl: project.imageUrl || "",
      projectUrl: project.projectUrl || "",
      githubUrl: project.githubUrl || "",
      featured: project.featured,
    });
    setEditingProject(project);
    setShowForm(true);
    setError(""); // Clear any previous errors when opening form
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let result;
      const toastId = toast.loading(
        editingProject ? "Updating project..." : "Adding project..."
      );

      if (editingProject && editingProject._id) {
        result = await updateProject(editingProject._id.toString(), formData);
      } else {
        result = await createProject(formData);
      }

      if (result.success) {
        toast.success(editingProject ? "Project updated!" : "Project added!", {
          id: toastId,
        });
        await loadProjects();
        resetForm();
      } else {
        const errorMsg = result.message || "Failed to save project";
        toast.error(errorMsg, { id: toastId });
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred while saving.";
      toast.error(errorMsg);
      setError(errorMsg);
      if (err instanceof Error) console.error("Submit error:", err.message);
      else console.error("Submit error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Opens the delete confirmation modal
  const handleDelete = (id: string) => {
    const projectToConfirm = projects.find((p) => p._id?.toString() === id);
    if (!projectToConfirm) {
      toast.error("Project not found for deletion.");
      return;
    }
    setProjectToDeleteId(id);
    setShowDeleteConfirmModal(true);
  };

  // Executes the deletion after confirmation
  const executeDeleteProject = async () => {
    if (!projectToDeleteId) return;

    setSaving(true); // Use 'saving' state to indicate an operation is in progress
    setError("");

    const toastId = toast.loading("Deleting project...");
    try {
      const result = await deleteProject(projectToDeleteId);
      if (result.success) {
        toast.success("Project deleted!", { id: toastId });
        await loadProjects();
      } else {
        const errorMsg = result.message || "Failed to delete project";
        toast.error(errorMsg, { id: toastId });
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred during deletion.";
      toast.error(errorMsg, { id: toastId });
      setError(errorMsg);
      if (err instanceof Error) console.error("Deletion error:", err.message);
      else console.error("Deletion error:", err);
    } finally {
      setShowDeleteConfirmModal(false);
      setProjectToDeleteId(null);
      setSaving(false);
    }
  };

  // Cancels the deletion and closes the modal
  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setProjectToDeleteId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "technologies") {
      setFormData((prev) => ({
        ...prev,
        technologies: value
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={null} />
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="mt-2 text-gray-600">
                Manage your portfolio projects.
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingProject(null);
                setError("");
              }} // Reset editingProject and error
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Project
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {/* Project Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Project Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Short Description *
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={2}
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="longDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Detailed Description
                      </label>
                      <textarea
                        name="longDescription"
                        id="longDescription"
                        rows={4}
                        value={formData.longDescription}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="technologies"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="technologies"
                        id="technologies"
                        placeholder="React, Node.js, MongoDB"
                        value={formData.technologies.join(", ")}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="projectUrl"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Live Demo URL
                        </label>
                        <input
                          type="url"
                          name="projectUrl"
                          id="projectUrl"
                          value={formData.projectUrl}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="githubUrl"
                          className="block text-sm font-medium text-gray-700"
                        >
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          name="githubUrl"
                          id="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="imageUrl"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Project Image URL
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        id="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="featured"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Featured project
                      </label>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                      >
                        <XMarkIcon className="h-5 w-5 mr-2" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 inline-flex items-center"
                      >
                        {saving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : editingProject ? (
                          <>
                            <PencilSquareIcon className="h-5 w-5 mr-2" />
                            Update
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Create
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirmModal && projectToDeleteId && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
              <div className="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                    Delete Project
                  </h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the project titled "
                      {projects.find(
                        (p) => p._id?.toString() === projectToDeleteId
                      )?.title || "this project"}
                      "? This action cannot be undone.
                    </p>
                  </div>
                  <div className="items-center px-4 py-3 space-x-4">
                    <button
                      onClick={executeDeleteProject}
                      disabled={saving}
                      className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                    <button
                      onClick={cancelDelete}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={
                  project._id
                    ? project._id.toString()
                    : Math.random().toString() // Fallback, though _id should always exist
                }
                className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full inline-flex items-center flex-shrink-0">
                        <StarIcon className="h-4 w-4 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex space-x-4">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 text-sm inline-flex items-center"
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800 text-sm inline-flex items-center"
                        >
                          <FaGithub className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          project._id && handleDelete(project._id.toString())
                        }
                        className="text-red-600 hover:text-red-800 text-sm inline-flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 &&
            !loading && ( // Added !loading condition
              <div className="text-center py-12">
                <FolderOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No projects
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first project.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingProject(null);
                      setError("");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Project
                  </button>
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}

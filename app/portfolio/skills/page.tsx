// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Navigation from "../../../components/Navigation";
// import {
//   getSkills,
//   createSkill,
//   updateSkill,
//   deleteSkill,
// } from "../../../lib/portfolioActions";
// import { SkillFormData } from "../../../lib/types";
// import { ISkill } from "../../../lib/models/Portfolio";
// import toast from "react-hot-toast";

// export default function SkillsPage() {
//   const router = useRouter();
//   const [skills, setSkills] = useState<ISkill[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingSkill, setEditingSkill] = useState<ISkill | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState<SkillFormData>({
//     name: "",
//     category: "",
//     level: 3,
//   });

//   useEffect(() => {
//     loadSkills();
//   }, []);

//   const loadSkills = async () => {
//     try {
//       const result = await getSkills();
//       if (result.success) {
//         setSkills(result.data || []);
//       }
//     } catch (error) {
//       console.error("Error loading skills:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       category: "",
//       level: 3,
//     });
//     setEditingSkill(null);
//     setShowForm(false);
//     setError("");
//   };

//   const handleEdit = (skill: ISkill) => {
//     setFormData({
//       name: skill.name,
//       category: skill.category,
//       level: skill.level,
//     });
//     setEditingSkill(skill);
//     setShowForm(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       let result;
//       const toastId = toast.loading(
//         editingSkill ? "Updating skill..." : "Adding skill..."
//       );

//       if (editingSkill && editingSkill._id) {
//         // Add null check and ensure _id is a string
//         result = await updateSkill(editingSkill._id.toString(), formData);
//       } else {
//         result = await createSkill(formData);
//       }

//       if (result.success) {
//         toast.success(editingSkill ? "Skill updated!" : "Skill added!", {
//           id: toastId,
//         });
//         await loadSkills();
//         resetForm();
//       } else {
//         toast.error(result.message || "Failed to save skill", { id: toastId });
//         setError(result.message || "Failed to save skill");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//       setError("An unexpected error occurred");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this skill?")) return;

//     const toastId = toast.loading("Deleting skill...");
//     try {
//       const result = await deleteSkill(id);
//       if (result.success) {
//         toast.success("Skill deleted!", { id: toastId });
//         await loadSkills();
//       } else {
//         toast.error(result.message || "Failed to delete skill", {
//           id: toastId,
//         });
//         setError(result.message || "Failed to delete skill");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred", { id: toastId });
//       setError("An unexpected error occurred");
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "level" ? parseInt(value) : value,
//     }));
//   };

//   // Group skills by category
//   const skillsByCategory = skills.reduce((acc: any, skill: any) => {
//     if (!acc[skill.category]) {
//       acc[skill.category] = [];
//     }
//     acc[skill.category].push(skill);
//     return acc;
//   }, {});

//   const renderStars = (level: number) => {
//     return (
//       <div className="flex space-x-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <svg
//             key={star}
//             className={`w-4 h-4 ${
//               star <= level ? "text-yellow-400" : "text-gray-300"
//             }`}
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navigation user={null} />

//       <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
//               <p className="mt-2 text-gray-600">
//                 Manage your technical and professional skills.
//               </p>
//             </div>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
//             >
//               Add Skill
//             </button>
//           </div>

//           {error && (
//             <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
//               <div className="text-red-800">{error}</div>
//             </div>
//           )}

//           {/* Skill Form Modal */}
//           {showForm && (
//             <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//               <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
//                 <div className="mt-3">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     {editingSkill ? "Edit Skill" : "Add New Skill"}
//                   </h3>

//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                       <label
//                         htmlFor="name"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Skill Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         id="name"
//                         required
//                         placeholder="e.g., React, Python, Project Management"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="category"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Category *
//                       </label>
//                       <input
//                         type="text"
//                         name="category"
//                         id="category"
//                         required
//                         placeholder="e.g., Frontend, Backend, Tools, Soft Skills"
//                         value={formData.category}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="level"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Proficiency Level *
//                       </label>
//                       <select
//                         name="level"
//                         id="level"
//                         value={formData.level}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       >
//                         <option value={1}>1 - Beginner</option>
//                         <option value={2}>2 - Basic</option>
//                         <option value={3}>3 - Intermediate</option>
//                         <option value={4}>4 - Advanced</option>
//                         <option value={5}>5 - Expert</option>
//                       </select>
//                     </div>

//                     <div className="flex justify-end space-x-4 pt-4">
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={saving}
//                         className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
//                       >
//                         {saving
//                           ? "Saving..."
//                           : editingSkill
//                           ? "Update"
//                           : "Create"}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Skills by Category */}
//           {Object.keys(skillsByCategory).length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {Object.entries(skillsByCategory).map(
//                 ([category, categorySkills]: [string, any]) => (
//                   <div
//                     key={category}
//                     className="bg-white shadow rounded-lg p-6"
//                   >
//                     <h3 className="text-lg font-medium text-gray-900 mb-4">
//                       {category}
//                     </h3>
//                     <div className="space-y-3">
//                       {categorySkills.map((skill: any) => (
//                         <div
//                           key={skill._id}
//                           className="flex items-center justify-between"
//                         >
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium text-gray-900">
//                                 {skill.name}
//                               </span>
//                               <div className="flex space-x-1">
//                                 <button
//                                   onClick={() => handleEdit(skill)}
//                                   className="text-indigo-600 hover:text-indigo-800 text-xs"
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleDelete(skill._id.toString())
//                                   }
//                                   className="text-red-600 hover:text-red-800 text-xs"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                             <div className="mt-1">
//                               {renderStars(skill.level)}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )
//               )}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//                 />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">
//                 No skills
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Get started by adding your first skill.
//               </p>
//               <div className="mt-6">
//                 <button
//                   onClick={() => setShowForm(true)}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Add Skill
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../../../lib/portfolioActions";
import { SkillFormData } from "../../../lib/types";
import { ISkill } from "../../../lib/models/Portfolio";
import toast from "react-hot-toast";

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  ExclamationCircleIcon,
  AcademicCapIcon, // For "No skills" placeholder
  PencilSquareIcon, // For form update button
  XMarkIcon, // For form cancel button
} from "@heroicons/react/20/solid";

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<ISkill | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // State for delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [skillToDeleteId, setSkillToDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    category: "",
    level: 3, // Default to Intermediate
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const result = await getSkills();
      if (result.success) {
        setSkills(result.data || []);
      } else {
        const errorMsg = result.message || "Failed to load skills.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred while loading skills.";
      setError(errorMsg);
      toast.error(errorMsg);
      if (err instanceof Error)
        console.error("Load skills error:", err.message);
      else console.error("Load skills error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      level: 3,
    });
    setEditingSkill(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (skill: ISkill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
    setEditingSkill(skill);
    setShowForm(true);
    setError(""); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let result;
      const toastId = toast.loading(
        editingSkill ? "Updating skill..." : "Adding skill..."
      );

      if (editingSkill && editingSkill._id) {
        result = await updateSkill(editingSkill._id.toString(), formData);
      } else {
        result = await createSkill(formData);
      }

      if (result.success) {
        toast.success(editingSkill ? "Skill updated!" : "Skill added!", {
          id: toastId,
        });
        await loadSkills();
        resetForm();
      } else {
        const errorMsg = result.message || "Failed to save skill";
        toast.error(errorMsg, { id: toastId });
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred while saving the skill.";
      toast.error(errorMsg);
      setError(errorMsg);
      if (err instanceof Error)
        console.error("Submit skill error:", err.message);
      else console.error("Submit skill error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Opens the delete confirmation modal
  const handleDelete = (id: string) => {
    const skillToConfirm = skills.find((s) => s._id?.toString() === id);
    if (!skillToConfirm) {
      toast.error("Skill not found for deletion.");
      return;
    }
    setSkillToDeleteId(id);
    setShowDeleteConfirmModal(true);
  };

  // Executes the deletion after confirmation
  const executeDeleteSkill = async () => {
    if (!skillToDeleteId) return;

    setSaving(true);
    setError("");

    const toastId = toast.loading("Deleting skill...");
    try {
      const result = await deleteSkill(skillToDeleteId);
      if (result.success) {
        toast.success("Skill deleted!", { id: toastId });
        await loadSkills();
      } else {
        const errorMsg = result.message || "Failed to delete skill";
        toast.error(errorMsg, { id: toastId });
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred during skill deletion.";
      toast.error(errorMsg, { id: toastId });
      setError(errorMsg);
      if (err instanceof Error)
        console.error("Deletion skill error:", err.message);
      else console.error("Deletion skill error:", err);
    } finally {
      setShowDeleteConfirmModal(false);
      setSkillToDeleteId(null);
      setSaving(false);
    }
  };

  // Cancels the deletion and closes the modal
  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setSkillToDeleteId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value) : value,
    }));
  };

  const skillsByCategory = skills.reduce(
    (acc: { [key: string]: ISkill[] }, skill: ISkill) => {
      const category = skill.category || "Uncategorized"; // Handle skills without a category
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {}
  );

  const renderStars = (level: number) => {
    return (
      <div className="flex space-x-0.5">
        {" "}
        {/* Reduced space for tighter stars */}
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-4 h-4 ${
              star <= level ? "text-yellow-400" : "text-gray-300"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    );
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
              <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
              <p className="mt-2 text-gray-600">
                Manage your technical and professional skills.
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingSkill(null);
                setError("");
                resetForm();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Skill
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {/* Skill Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingSkill ? "Edit Skill" : "Add New Skill"}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Skill Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        placeholder="e.g., React, Python, Project Management"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category *
                      </label>
                      <input
                        type="text"
                        name="category"
                        id="category"
                        required
                        placeholder="e.g., Frontend, Backend, Tools"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="level"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Proficiency Level *
                      </label>
                      <select
                        name="level"
                        id="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value={1}>1 - Beginner</option>
                        <option value={2}>2 - Basic</option>
                        <option value={3}>3 - Intermediate</option>
                        <option value={4}>4 - Advanced</option>
                        <option value={5}>5 - Expert</option>
                      </select>
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
                        ) : editingSkill ? (
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
          {showDeleteConfirmModal && skillToDeleteId && (
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
                    Delete Skill
                  </h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the skill "
                      {skills.find((s) => s._id?.toString() === skillToDeleteId)
                        ?.name || "this skill"}
                      "? This action cannot be undone.
                    </p>
                  </div>
                  <div className="items-center px-4 py-3 space-x-4">
                    <button
                      onClick={executeDeleteSkill}
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

          {/* Skills by Category */}
          {Object.keys(skillsByCategory).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillsByCategory).map(
                ([category, categorySkills]: [string, ISkill[]]) => (
                  <div
                    key={category}
                    className="bg-white shadow rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                      {category}
                    </h3>
                    <div className="space-y-4">
                      {categorySkills.map((skill) => (
                        <div
                          key={
                            skill._id
                              ? skill._id.toString()
                              : Math.random().toString()
                          }
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">
                              {skill.name}
                            </span>
                            <div className="mt-1">
                              {renderStars(skill.level)}
                            </div>
                          </div>
                          <div className="flex space-x-2 items-center">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50"
                              title="Edit skill"
                            >
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                skill._id && handleDelete(skill._id.toString())
                              }
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Delete skill"
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No skills
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first skill.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingSkill(null);
                    setError("");
                    resetForm();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Skill
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

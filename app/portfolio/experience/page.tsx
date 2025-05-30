// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Navigation from "../../../components/Navigation";
// import {
//   getExperiences,
//   createExperience,
//   updateExperience,
//   deleteExperience,
// } from "../../../lib/portfolioActions";
// import { ExperienceFormData } from "../../../lib/types";
// import { IExperience } from "../../../lib/models/Portfolio";
// import { IUser } from "../../../lib/models/User";
// import toast from "react-hot-toast";
// import { getClientSession } from "../../../lib/clientAuth"; // Import the client-side function

// export default function ExperiencePage() {
//   const router = useRouter();
//   const [experiences, setExperiences] = useState<IExperience[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingExperience, setEditingExperience] =
//     useState<IExperience | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [user, setUser] = useState<IUser | null>(null);

//   const [formData, setFormData] = useState<ExperienceFormData>({
//     company: "",
//     position: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     current: false,
//     location: "",
//   });

//   useEffect(() => {
//     // Load user session
//     const loadUser = async () => {
//       try {
//         const userSession = await getClientSession();
//         setUser(userSession);
//         if (!userSession) {
//           router.push("/login");
//         }
//       } catch (error) {
//         console.error("Error loading user session:", error);
//       }
//     };

//     loadUser();
//     loadExperiences();
//   }, [router]);

//   const loadExperiences = async () => {
//     try {
//       const result = await getExperiences();
//       if (result.success) {
//         setExperiences(result.data || []);
//       }
//     } catch (error) {
//       console.error("Error loading experiences:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       company: "",
//       position: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//       current: false,
//       location: "",
//     });
//     setEditingExperience(null);
//     setShowForm(false);
//     setError("");
//   };

//   const handleEdit = (experience: IExperience) => {
//     setFormData({
//       company: experience.company,
//       position: experience.position,
//       description: experience.description,
//       startDate: new Date(experience.startDate).toISOString().split("T")[0],
//       endDate: experience.endDate
//         ? new Date(experience.endDate).toISOString().split("T")[0]
//         : "",
//       current: experience.current,
//       location: experience.location || "",
//     });
//     setEditingExperience(experience);
//     setShowForm(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");

//     try {
//       let result;
//       const toastId = toast.loading(
//         editingExperience ? "Updating experience..." : "Adding experience..."
//       );

//       if (editingExperience && editingExperience._id) {
//         // Add null check and ensure _id is a string
//         result = await updateExperience(
//           editingExperience._id.toString(),
//           formData
//         );
//       } else {
//         result = await createExperience(formData);
//       }

//       if (result.success) {
//         toast.success(
//           editingExperience ? "Experience updated!" : "Experience added!",
//           { id: toastId }
//         );
//         await loadExperiences();
//         resetForm();
//       } else {
//         toast.error(result.message || "Failed to save experience", {
//           id: toastId,
//         });
//         setError(result.message || "Failed to save experience");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//       setError("An unexpected error occurred");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this experience?")) return;

//     const toastId = toast.loading("Deleting experience...");
//     try {
//       const result = await deleteExperience(id);
//       if (result.success) {
//         toast.success("Experience deleted!", { id: toastId });
//         await loadExperiences();
//       } else {
//         toast.error(result.message || "Failed to delete experience", {
//           id: toastId,
//         });
//         setError(result.message || "Failed to delete experience");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred", { id: toastId });
//       setError("An unexpected error occurred");
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       year: "numeric",
//     });
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
//       <Navigation user={user} />

//       <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Work Experience
//               </h1>
//               <p className="mt-2 text-gray-600">
//                 Manage your professional work experience and career history.
//               </p>
//             </div>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
//             >
//               Add Experience
//             </button>
//           </div>

//           {error && (
//             <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
//               <div className="text-red-800">{error}</div>
//             </div>
//           )}

//           {/* Experience Form Modal */}
//           {showForm && (
//             <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//               <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
//                 <div className="mt-3">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     {editingExperience
//                       ? "Edit Experience"
//                       : "Add New Experience"}
//                   </h3>

//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                       <div>
//                         <label
//                           htmlFor="company"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Company *
//                         </label>
//                         <input
//                           type="text"
//                           name="company"
//                           id="company"
//                           required
//                           value={formData.company}
//                           onChange={handleInputChange}
//                           className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         />
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="position"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Position *
//                         </label>
//                         <input
//                           type="text"
//                           name="position"
//                           id="position"
//                           required
//                           value={formData.position}
//                           onChange={handleInputChange}
//                           className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="description"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Job Description *
//                       </label>
//                       <textarea
//                         name="description"
//                         id="description"
//                         rows={4}
//                         required
//                         placeholder="Describe your responsibilities and achievements..."
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="location"
//                         className="block text-sm font-medium text-gray-700"
//                       >
//                         Location
//                       </label>
//                       <input
//                         type="text"
//                         name="location"
//                         id="location"
//                         placeholder="e.g., San Francisco, CA or Remote"
//                         value={formData.location}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                       <div>
//                         <label
//                           htmlFor="startDate"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Start Date *
//                         </label>
//                         <input
//                           type="date"
//                           name="startDate"
//                           id="startDate"
//                           required
//                           value={formData.startDate}
//                           onChange={handleInputChange}
//                           className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         />
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="endDate"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           End Date
//                         </label>
//                         <input
//                           type="date"
//                           name="endDate"
//                           id="endDate"
//                           disabled={formData.current}
//                           value={formData.endDate}
//                           onChange={handleInputChange}
//                           className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex items-center">
//                       <input
//                         type="checkbox"
//                         name="current"
//                         id="current"
//                         checked={formData.current}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       />
//                       <label
//                         htmlFor="current"
//                         className="ml-2 block text-sm text-gray-900"
//                       >
//                         I currently work here
//                       </label>
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
//                           : editingExperience
//                           ? "Update"
//                           : "Create"}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Experience Timeline */}
//           {experiences.length > 0 ? (
//             <div className="space-y-6">
//               {experiences.map((experience) => (
//                 <div
//                   key={
//                     experience._id
//                       ? experience._id.toString()
//                       : Math.random().toString()
//                   }
//                   className="bg-white shadow rounded-lg p-6"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-lg font-medium text-gray-900">
//                           {experience.position}
//                         </h3>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleEdit(experience)}
//                             className="text-indigo-600 hover:text-indigo-800 text-sm"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() =>
//                               experience._id &&
//                               handleDelete(experience._id.toString())
//                             }
//                             className="text-red-600 hover:text-red-800 text-sm"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>

//                       <p className="text-indigo-600 font-medium">
//                         {experience.company}
//                       </p>

//                       <div className="flex items-center mt-1 text-sm text-gray-600">
//                         <span>
//                           {formatDate(experience.startDate.toString())} -{" "}
//                           {experience.current
//                             ? "Present"
//                             : formatDate(experience.endDate?.toString() || "")}
//                         </span>
//                         {experience.location && (
//                           <>
//                             <span className="mx-2">•</span>
//                             <span>{experience.location}</span>
//                           </>
//                         )}
//                       </div>

//                       <p className="mt-3 text-gray-700">
//                         {experience.description}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
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
//                   d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
//                 />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">
//                 No work experience
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Get started by adding your first job experience.
//               </p>
//               <div className="mt-6">
//                 <button
//                   onClick={() => setShowForm(true)}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Add Experience
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
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../../lib/portfolioActions";
import { ExperienceFormData } from "../../../lib/types";
import { IExperience } from "../../../lib/models/Portfolio";
import { IUser } from "../../../lib/models/User";
import toast from "react-hot-toast";
import { getClientSession } from "../../../lib/clientAuth";

import {
  BriefcaseIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
  BuildingOffice2Icon,
  UserGroupIcon, // Or IdentificationIcon for Position
  PencilSquareIcon, // For Description and Update button
  MapPinIcon,
  CalendarDaysIcon,
  CheckCircleIcon, // For "current" checkbox and success
  XMarkIcon, // For Cancel button
} from "@heroicons/react/20/solid";

export default function ExperiencePage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<IExperience | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<IUser | null>(null);

  // State for delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [experienceToDeleteId, setExperienceToDeleteId] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState<ExperienceFormData>({
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
    location: "",
  });

  useEffect(() => {
    const loadUserAndData = async () => {
      try {
        setLoading(true);
        const userSession = await getClientSession();
        setUser(userSession);
        if (!userSession) {
          toast.error("Session expired. Please log in.");
          router.push("/login");
          return;
        }
        await loadExperiences();
      } catch (error) {
        console.error("Error in initial load:", error);
        setError("Failed to load initial page data.");
        toast.error("Failed to load initial page data.");
      } finally {
        setLoading(false);
      }
    };

    loadUserAndData();
  }, [router]);

  const loadExperiences = async () => {
    try {
      // setLoading(true); // Handled by parent useEffect
      const result = await getExperiences();
      if (result.success) {
        setExperiences(result.data || []);
      } else {
        const errorMsg = result.message || "Failed to load experiences.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        "An unexpected error occurred while loading experiences.";
      setError(errorMsg);
      toast.error(errorMsg);
      if (err instanceof Error)
        console.error("Load experiences error:", err.message);
      else console.error("Load experiences error:", err);
    }
    // finally { setLoading(false); } // Handled by parent useEffect
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
    });
    setEditingExperience(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (experience: IExperience) => {
    setFormData({
      company: experience.company,
      position: experience.position,
      description: experience.description,
      startDate: new Date(experience.startDate).toISOString().split("T")[0],
      endDate: experience.endDate
        ? new Date(experience.endDate).toISOString().split("T")[0]
        : "",
      current: experience.current,
      location: experience.location || "",
    });
    setEditingExperience(experience);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let result;
      const toastId = toast.loading(
        editingExperience ? "Updating experience..." : "Adding experience..."
      );

      if (editingExperience && editingExperience._id) {
        result = await updateExperience(
          editingExperience._id.toString(),
          formData
        );
      } else {
        result = await createExperience(formData);
      }

      if (result.success) {
        toast.success(
          editingExperience ? "Experience updated!" : "Experience added!",
          { id: toastId }
        );
        await loadExperiences();
        resetForm();
      } else {
        const errorMsg = result.message || "Failed to save experience";
        toast.error(errorMsg, { id: toastId });
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred while saving.";
      toast.error(errorMsg);
      setError(errorMsg);
      if (err instanceof Error)
        console.error("Submit experience error:", err.message);
      else console.error("Submit experience error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    const expToConfirm = experiences.find((exp) => exp._id?.toString() === id);
    if (!expToConfirm) {
      toast.error("Experience not found for deletion.");
      return;
    }
    setExperienceToDeleteId(id);
    setShowDeleteConfirmModal(true);
  };

  const executeDeleteExperience = async () => {
    if (!experienceToDeleteId) return;

    setSaving(true);
    setError("");

    const toastId = toast.loading("Deleting experience...");
    try {
      const result = await deleteExperience(experienceToDeleteId);
      if (result.success) {
        toast.success("Experience deleted!", { id: toastId });
        await loadExperiences();
      } else {
        const errorMsg = result.message || "Failed to delete experience";
        toast.error(errorMsg, { id: toastId });
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred during deletion.";
      toast.error(errorMsg, { id: toastId });
      setError(errorMsg);
      if (err instanceof Error)
        console.error("Deletion experience error:", err.message);
      else console.error("Deletion experience error:", err);
    } finally {
      setShowDeleteConfirmModal(false);
      setExperienceToDeleteId(null);
      setSaving(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setExperienceToDeleteId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // For checkbox

    setFormData((prev) => {
      const newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      // If "current" is checked, disable and clear endDate
      if (name === "current" && checked) {
        newState.endDate = "";
      }
      return newState;
    });
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  if (loading && !user) {
    // Show full page loader only if user is not yet loaded (initial load)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />

      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 inline-flex items-center">
                <BriefcaseIcon className="h-8 w-8 mr-3 text-indigo-600" />
                Work Experience
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your professional work experience and career history.
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingExperience(null);
                setError("");
                resetForm();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Experience
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {/* Experience Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-10 md:top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingExperience
                      ? "Edit Experience"
                      : "Add New Experience"}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium text-gray-700"
                        >
                          <BuildingOffice2Icon className="h-5 w-5 mr-1 inline-block text-gray-400" />
                          Company *
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="company"
                          required
                          value={formData.company}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="position"
                          className="block text-sm font-medium text-gray-700"
                        >
                          <UserGroupIcon className="h-5 w-5 mr-1 inline-block text-gray-400" />
                          Position *
                        </label>
                        <input
                          type="text"
                          name="position"
                          id="position"
                          required
                          value={formData.position}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <PencilSquareIcon className="h-5 w-5 mr-1 inline-block text-gray-400" />
                        Job Description *
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={4}
                        required
                        placeholder="Describe your responsibilities and achievements..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <MapPinIcon className="h-5 w-5 mr-1 inline-block text-gray-400" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        placeholder="e.g., San Francisco, CA or Remote"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          <CalendarDaysIcon className="h-5 w-5 mr-1 inline-block text-gray-400" />
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          id="startDate"
                          required
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          <CalendarDaysIcon className="h-5 w-5 mr-1 inline-block text-gray-400" />
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          id="endDate"
                          disabled={formData.current}
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="current"
                        id="current"
                        checked={formData.current}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="current"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-1 inline-block text-gray-400" />
                        I currently work here
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
                        ) : editingExperience ? (
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
          {showDeleteConfirmModal && experienceToDeleteId && (
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
                    Delete Experience
                  </h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the experience as "
                      {experiences.find(
                        (exp) => exp._id?.toString() === experienceToDeleteId
                      )?.position || "this experience"}
                      " at "
                      {experiences.find(
                        (exp) => exp._id?.toString() === experienceToDeleteId
                      )?.company || ""}
                      "? This action cannot be undone.
                    </p>
                  </div>
                  <div className="items-center px-4 py-3 space-x-4">
                    <button
                      onClick={executeDeleteExperience}
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

          {/* Experience Timeline */}
          {loading &&
            experiences.length === 0 && ( // Show list loading indicator
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading experiences...</p>
              </div>
            )}

          {!loading && experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((experience) => (
                <div
                  key={
                    experience._id
                      ? experience._id.toString()
                      : Math.random().toString()
                  }
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {experience.position}
                      </h3>
                      <p className="text-md font-medium text-indigo-600">
                        <BuildingOffice2Icon className="h-5 w-5 mr-1 inline-block align-text-bottom" />
                        {experience.company}
                      </p>

                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 mr-1 inline-block" />
                        <span>
                          {formatDate(experience.startDate)} -{" "}
                          {experience.current
                            ? "Present"
                            : formatDate(experience.endDate)}
                        </span>
                        {experience.location && (
                          <>
                            <span className="mx-2 text-gray-300">•</span>
                            <MapPinIcon className="h-4 w-4 mr-1 inline-block" />
                            <span>{experience.location}</span>
                          </>
                        )}
                      </div>

                      <p className="mt-3 text-gray-700 whitespace-pre-line">
                        {experience.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(experience)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm p-2 rounded hover:bg-indigo-50 inline-flex items-center"
                        title="Edit Experience"
                      >
                        <PencilIcon className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          experience._id &&
                          handleDelete(experience._id.toString())
                        }
                        className="text-red-600 hover:text-red-800 text-sm p-2 rounded hover:bg-red-50 inline-flex items-center"
                        title="Delete Experience"
                      >
                        <TrashIcon className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading &&
            experiences.length === 0 && (
              <div className="text-center py-12">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No work experience
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding your first job experience.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingExperience(null);
                      setError("");
                      resetForm();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Experience
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

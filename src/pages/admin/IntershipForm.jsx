import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaClipboardList,
  FaFileSignature,
  FaRegFileAlt,
  FaSuitcase,
} from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import {
  FormInputField,
  FormTextAreaField,
} from "../../components/Common/InputField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";
import DesktopOnly from "../../components/Common/DesktopOnly";

const loadingStates = [
  { text: "Gathering internship details" },
  { text: "Checking application deadline" },
  { text: "Preparing application process" },
  { text: "Validating internship details" },
  { text: "Finalizing internship posting" },
];

const InternshipDetails = ({ formData, setFormData }) => {
  return (
    <>
      {/* Left Column */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Internship Title"
          required
          args={{
            placeholder: "Enter Internship Title",
            value: formData.title,
            maxLength: 100,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^A-Za-z ]/g, "");
            setFormData((prev) => ({ ...prev, title: filteredValue }));
          }}
        />
        <FormInputField
          label="Internship Location"
          required
          args={{
            placeholder: "Enter Internship Location",
            value: formData.location,
            maxLength: 100,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^A-Za-z ,]/g, "");
            setFormData((prev) => ({ ...prev, location: filteredValue }));
          }}
        />
        <FormInputField
          label="Industry Type"
          args={{
            placeholder: "Enter Industry Type",
            value: formData.industry_type,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, industry_type: val }))
          }
        />
        <FormInputField
          label="Stipend Range"
          args={{
            placeholder: "Enter Stipend Range (e.g., 500 - 1000)",
            value: formData.stipend,
            maxLength: 10,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^0-9-]/g, "");
            setFormData((prev) => ({ ...prev, stipend: filteredValue }));
          }}
          type="text"
        />
                <FormInputField
          label="Duration"
          required
          args={{
            placeholder: "Enter Duration (e.g., 3 months)",
            value: formData.duration,
            maxLength: 50,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^0-9A-Za-z ]/g, "");
            setFormData((prev) => ({ ...prev, duration: filteredValue }));
          }}
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Internship Type"
          args={{
            placeholder: "Enter Internship Type",
            value: formData.internship_type,
            maxLength: 100,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^A-Za-z ]/g, "");
            setFormData((prev) => ({ ...prev, internship_type: filteredValue }));
          }}
        />
        <FormInputField
          label="Company Name"
          args={{
            placeholder: "Enter Company Name",
            value: formData.company_name,
            maxLength: 100,
          }}
          setter={(val) => {
            const filteredValue = val.replace(/[^A-Za-z0-9 &]/g, "");
            setFormData((prev) => ({ ...prev, company_name: filteredValue }));
          }}
        />
        <FormTextAreaField
          label="Internship Description"
          args={{
            placeholder: "Enter a brief description of the internship",
            value: formData.job_description,
            maxLength: 5000,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, job_description: val }))
          }
        />
        <FormInputField
          label="Company Website"
          args={{
            placeholder: "Enter Company Website URL",
            value: formData.company_website,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, company_website: val }))
          }
        />

        
      </div>
    </>
  );
};

const TagInput = ({ label, required, value, setter, placeholder, maxLength }) => {
  const [tags, setTags] = useState(Array.isArray(value) ? value : []);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Update internal tags when value changes from outside
    if (Array.isArray(value)) {
      setTags(value.filter(tag => tag.trim() !== ''));
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      const newTags = [...tags, trimmedInput];
      setTags(newTags);
      setter(newTags);
      setInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setter(newTags);
  };

  const handleInputChange = (e) => {
    // If the user types a comma, add the tag
    const value = e.target.value;
    if (value.includes(',')) {
      const parts = value.split(',');
      const newTag = parts[0].trim();
      
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        setter(newTags);
      }
      
      // Keep any text after the last comma in the input
      setInput(parts[parts.length - 1].trim());
    } else {
      setInput(value);
    }
  };

  const handleBlur = () => {
    if (input.trim()) {
      addTag();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-yellow-100 border border-yellow-300 rounded-md px-1 mb-0.5 ml-1 mr-1 py-1 flex items-center"
          >
            <span className="text-sm">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length ? "" : placeholder}
          className="flex-grow outline-none p-1 text-sm resize-none min-h-[24px] overflow-hidden"
          maxLength={maxLength}
          rows={1}
        />
      </div>
      <p className="text-xs text-gray-500">Press comma or Enter to add</p>
    </div>
  );
};

const InternshipRequirements = ({ formData, setFormData }) => {
  const [imagePreview, setImagePreview] = useState(() => {
    const savedImage = localStorage.getItem("jobImagePreview");
    return savedImage || null;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        const imageUrl = URL.createObjectURL(file);
        setFormData({ ...formData, image: file });
        setImagePreview(imageUrl);
        localStorage.setItem("jobImagePreview", imageUrl);
        const fileInfo = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        };
        localStorage.setItem("jobImageFile", JSON.stringify(fileInfo));
      } else {
        toast.error("Only JPG and PNG images are allowed.");
        setFormData({ ...formData, image: null });
        setImagePreview(null);
        localStorage.removeItem("jobImagePreview");
        localStorage.removeItem("jobImageFile");
      }
    }
  };
  
  const handleImageDelete = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFormData({ ...formData, image: null });
    localStorage.removeItem("jobImagePreview");
    localStorage.removeItem("jobImageFile");
  };
  
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <>
      {/* Left Column */}
      <div className="flex flex-col space-y-5">
        <TagInput
          label="Technical Skills Required"
          args={{
            placeholder: "Enter Technical Skills (comma-separated)",
            value: formData.technical_skills.join(","),
            maxLength: 300,
          }}
          setter={(val) => setFormData(prev => ({ ...prev, technical_skills: val }))}
        />
        <TagInput
          label="Soft Skills Required"
          args={{
            placeholder: "Enter Soft Skills (comma-separated)",
            value: formData.soft_skills.join(","),
            maxLength: 300,
          }}
          setter={(val) => setFormData(prev => ({ ...prev, technical_skills: val }))}
        />
        <FormInputField
          label="Educational Requirement"
          args={{
            placeholder: "Enter Educational Requirement (e.g., Bachelor's Degree)",
            value: formData.education_requirements,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, education_requirements: val }))
          }
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-5">
        <FormTextAreaField
          label="Documents Required"
          args={{
            placeholder: "List required documents (e.g., Resume, Cover Letter)",
            value: formData.documents_required,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, documents_required: val }))
          }
        />
        <TagInput
          label="Additional Skills"
          args={{
            placeholder: "Enter Additional Skills (comma-separated)",
            value: formData.additional_skills.join(","),
            maxLength: 300,
          }}
          setter={(val) => setFormData(prev => ({ ...prev, technical_skills: val }))}
        />
      </div>

      {/* Image Upload Section - Full Width */}
      <div className="col-span-2 mt-8">
        <div className="border-2 border-gray-300 border-dashed rounded-xl px-3 py-2 text-center bg-white w-full hover:border-[#ffcc00] transition-colors">
          <label
            htmlFor="image"
            className="cursor-pointer text-gray-600 text-lg flex flex-col items-center"
          >
            <div className="mb-3 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#ffcc00"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-lg font-medium">
              {imagePreview ? "Change Image" : "Upload a job-related photo"}
            </span>
            <span className="text-sm text-gray-400 mt-2">JPG or PNG format only</span>
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview && (
            <div className="mt-6 relative">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="mx-auto rounded-lg mb-4 shadow-md max-w-full h-auto"
                style={{ maxHeight: "250px" }}
              />
              <button
                type="button"
                onClick={handleImageDelete}
                className="absolute top-2 right-2 bg-white text-red-500 p-1 rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ApplicationProcess = ({ formData, setFormData }) => {
  return (
    <>
      {/* Left Column */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Internship Posting Date"
          args={{
            placeholder: "Posting Date",
            type: "date",
            value: new Date().toISOString().split("T")[0],
            readOnly: true,
          }}
          setter={() => {}}
          type="date"
        />
        <FormInputField
          label="Application Deadline"
          required={true}
          args={{
            placeholder: "Enter Application Deadline",
            type: "date",
            value: formData.application_deadline,
            min: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, application_deadline: val }))
          }
          type="date"
        />
        <FormInputField
          label="Interview Start Date (If Applicable)"
          args={{
            placeholder: "Enter Interview Start Date",
            type: "date",
            value: formData.interview_start_date,
            min: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, interview_start_date: val }))
          }
          type="date"
        />
        <FormTextAreaField
          label="Steps to Apply"
          args={{
            placeholder: "Describe the steps candidates need to take to apply",
            value: formData.steps_to_apply,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, steps_to_apply: val }))
          }
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-5">
        <FormInputField
          label="Interview End Date (If Applicable)"
          args={{
            placeholder: "Enter Interview End Date",
            type: "date",
            value: formData.interview_end_date,
            min: formData.interview_start_date
              ? new Date(new Date(formData.interview_start_date).getTime() + 86400000)
                  .toISOString()
                  .split("T")[0]
              : new Date(Date.now() + 86400000).toISOString().split("T")[0],
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, interview_end_date: val }))
          }
          type="date"
        />
        <FormInputField
          label="Internship Link"
          required={true}
          args={{
            placeholder: "Enter the application link",
            value: formData.internship_link.trim(),
            maxLength: 300,
          }}
          setter={(val) => {
            const filteredValue = val.trim();
            setFormData((prev) => ({ ...prev, internship_link: filteredValue }));
          }}
        />
        <FormTextAreaField
          label="Selection Process"
          args={{
            placeholder: "Describe the selection process for applicants",
            value: formData.selection_process,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, selection_process: val }))
          }
        />
      </div>
    </>
  );
};

const InternshipPreview = ({ formData, setFormData }) => {
  return (
    <>
      {/* Left Column */}
      <div className="flex flex-col space-y-4">
        <FormInputField
          label="Internship Title"
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Internship Title",
            value: formData.title,
            maxLength: 300,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, title: val }))}
        />
        <FormInputField
          label="Internship Location"
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Internship Location",
            value: formData.location,
            maxLength: 300,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, location: val }))}
        />
        <FormInputField
          label="Application Deadline"
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Application Deadline",
            type: "date",
            value: formData.application_deadline,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, application_deadline: val }))
          }
        />
        <FormInputField
          label="Internship Type"
          disabled={true}
          args={{
            placeholder: "Enter Internship Type",
            value: formData.internship_type,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_type: val }))
          }
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-4">
        <FormInputField
          label="Company Name"
          disabled={true}
          args={{
            placeholder: "Enter Company Name",
            value: formData.company_name,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, company_name: val }))
          }
        />
        <FormTextAreaField
          label="Internship Description"
          disabled={true}
          args={{
            placeholder: "Enter a brief description of the internship",
            value: formData.job_description,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, job_description: val }))
          }
        />
        <FormInputField
          label="Internship Link"
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter the application link",
            value: formData.internship_link,
            maxLength: 300,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_link: val }))
          }
        />
        <FormInputField
          label="Duration"
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Duration (e.g., 3 months)",
            value: formData.duration,
            maxLength: 300,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, duration: val }))}
        />
        <FormInputField
          label="Stipend Range"
          disabled={true}
          args={{
            placeholder: "Enter Stipend Range (e.g., 500 - 1000)",
            value: formData.stipend,
            maxLength: 300,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, stipend: val }))}
        />
      </div>
    </>
  );
};

const InternPostForm = () => {
  const storedInternshipData = sessionStorage.getItem("internshipData");
  const initialInternshipData = storedInternshipData
    ? JSON.parse(storedInternshipData)
    : {};

  const [formData, setFormData] = useState({
    title: initialInternshipData.title || "",
    company_name: initialInternshipData.company_name || "",
    location: initialInternshipData.location || "",
    industry_type: initialInternshipData.industry_type || "",
    internship_type: initialInternshipData.internship_type || "",
    duration: initialInternshipData.duration || "",
    stipend: initialInternshipData.stipend || "",
    application_deadline:
      initialInternshipData.application_deadline &&
      !isNaN(Date.parse(initialInternshipData.application_deadline))
        ? initialInternshipData.application_deadline
        : null,
    skills_required: initialInternshipData.required_skills || [],
    job_description: initialInternshipData.job_description || "",
    company_website: initialInternshipData.company_website || "",
    job_link: initialInternshipData.job_link || "",
    education_requirements: initialInternshipData.education_requirements || "",
    technical_skills: initialInternshipData.technical_skills || [],
    soft_skills: initialInternshipData.soft_skills || [],
    documents_required: initialInternshipData.documents_required || "",
    additional_skills: initialInternshipData.additional_skills || [],
    internship_posting_date:
      initialInternshipData.internship_posting_date &&
      !isNaN(Date.parse(initialInternshipData.internship_posting_date))
        ? initialInternshipData.internship_posting_date.split("T")[0]
        : null,
    interview_start_date:
      initialInternshipData.interview_start_date &&
      !isNaN(Date.parse(initialInternshipData.interview_start_date))
        ? initialInternshipData.interview_start_date.split("T")[0]
        : null,
    interview_end_date:
      initialInternshipData.interview_end_date &&
      !isNaN(Date.parse(initialInternshipData.interview_end_date))
        ? initialInternshipData.interview_end_date.split("T")[0]
        : null,
    internship_link: initialInternshipData.internship_link || "",
    selection_process: initialInternshipData.selection_process || "",
    steps_to_apply: initialInternshipData.steps_to_apply || "",
    image: initialInternshipData.image || null,
  });

  const [initialFormData, setInitialFormData] = useState({ ...formData });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [urlError, setUrlError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const [deadlineError, setDeadlineError] = useState("");
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [categories, setCategories] = useState({
    "Internship Details": { status: "active", icon: <FaSuitcase /> },
    "Internship Requirements": { status: "unvisited", icon: <FaClipboardList /> },
    "Application Process": { status: "unvisited", icon: <FaFileSignature /> },
    Summary: { status: "unvisited", icon: <FaRegFileAlt /> },
  });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      setError("Token has expired. Please log in again.");
      return;
    }
    if (decodedToken.role !== "superadmin" && decodedToken.role !== "admin") {
      setError("You do not have permission to access this page.");
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserRole(payload.role);
    setUserId(payload.role === "admin" ? payload.admin_user : payload.superadmin_user);
  }, []);

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const validateDeadline = (date) => {
    const currentDate = new Date();
    if (date < currentDate) {
      setDeadlineError("Application deadline must be a future date.");
      return false;
    } else {
      setDeadlineError("");
      return true;
    }
  };

  const handleSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (formData.application_deadline < today) {
      toast.error("Application deadline must be a future date.");
      return;
    }
    if (formData.company_website && !validateUrl(formData.company_website)) {
      toast.error("Invalid URL");
      return;
    }
    if (!validateDeadline(formData.application_deadline)) {
      toast.error("Please check the deadline");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      setIsSubmitting(true);
      setMessage("");
      setError("");
      try {
        const token = Cookies.get("jwt");
        if (!token) {
          setError("No token found. Please log in.");
          setIsSubmitting(false);
          setLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        const internshipData = {
          ...formData,
          required_skills: formData.technical_skills,
        };

        if (internshipData.image instanceof File) {
          formDataToSend.append("image", internshipData.image);
        } else {
          delete internshipData.image;
        }

        Object.keys(internshipData).forEach((key) => {
          if (
            key === "application_deadline" &&
            internshipData[key] instanceof Date
          ) {
            internshipData[key] = internshipData[key].toISOString().split("T")[0];
          } else if (
            key === "application_deadline" &&
            typeof internshipData[key] === "string"
          ) {
            const date = new Date(internshipData[key]);
            internshipData[key] = !isNaN(date.getTime())
              ? date.toISOString().split("T")[0]
              : internshipData[key];
          } else if (
            internshipData[key] === "" ||
            internshipData[key] === null ||
            internshipData[key] === undefined
          ) {
            internshipData[key] = "NA";
          }
        });

        formDataToSend.append("data", JSON.stringify(internshipData));
        formDataToSend.append("role", userRole);
        formDataToSend.append("userId", userId);

        const internshipId = sessionStorage.getItem("internshipId");
        const url = internshipId
          ? `${API_BASE_URL}/api/internship-edit/${internshipId}/`
          : `${API_BASE_URL}/api/post-internship/`;
          
        // Changed from axios.put to axios.post for both create and edit modes
        const response = await axios.post(url, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setMessage(response.data.message);
        sessionStorage.removeItem("internshipData");
        sessionStorage.removeItem("internshipId");
        const returnUrl = sessionStorage.getItem("returnToPreview");
        sessionStorage.removeItem("returnToPreview");
        navigate(returnUrl || "/internships");
      } catch (error) {
        console.error("API Error:", error);
        setError(
          `Error: ${error.response?.data?.error || "Something went wrong"}`
        );
        setToastMessage(
          `Error: ${error.response?.data?.error || "Something went wrong"}`
        );
      } finally {
        setIsSubmitting(false);
        setLoading(false);
      }
    }, 10000);
  };

  const categoryKeys = Object.keys(categories);
  const activeIndex = categoryKeys.findIndex(
    (key) => categories[key].status === "active"
  );

  const handleNavigation = (direction) => {
    setCategories((prevCategories) => {
      const updatedCategories = { ...prevCategories };
      if (activeIndex !== -1) {
        const currentKey = categoryKeys[activeIndex];
        const nextIndex =
          direction === "next" ? activeIndex + 1 : activeIndex - 1;

        if (nextIndex >= 0 && nextIndex < categoryKeys.length) {
          const nextKey = categoryKeys[nextIndex];
          if (direction === "next") {
            updatedCategories[currentKey] = {
              ...updatedCategories[currentKey],
              status: "completed",
            };
          }
          updatedCategories[nextKey] = {
            ...updatedCategories[nextKey],
            status: "active",
          };
          if (direction === "prev") {
            for (let i = nextIndex + 1; i < categoryKeys.length; i++) {
              updatedCategories[categoryKeys[i]] = {
                ...updatedCategories[categoryKeys[i]],
                status: "unvisited",
              };
            }
          }
        }
      }
      return updatedCategories;
    });
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <motion.div className="flex bg-gray-100 min-h-screen">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <ToastContainer />
      <DesktopOnly />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex-1 p-8 bg-white rounded-xl flex flex-col h-full max-w-[1400px] mx-auto shadow-lg">
          <div className="flex justify-between items-center text-2xl pb-4 border-b border-gray-300 mb-4">
            <p className="font-semibold">Post an Internship</p>
            <button
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition-colors"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg z-50">
              {error}
            </div>
          )}

          {toastMessage && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg z-50">
              {toastMessage}
            </div>
          )}

          <div className="flex items-stretch gap-6 flex-1">
            {/* Sidebar */}
            <div
              className={`w-1/4 flex flex-col p-4 bg-gray-50 rounded-xl ${
                isSidebarOpen ? "block" : "hidden md:block"
              }`}
            >
              <button
                className="md:hidden mb-4 px-4 py-2 bg-gray-200 rounded-md text-sm"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? "Hide Steps" : "Show Steps"}
              </button>
              <div className="border border-gray-200 flex flex-col rounded-lg bg-white shadow-sm mb-6">
                <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
                {Object.entries(categories).map(([category, prop], key, array) => (
                  <div
                    key={category}
                    className={`border-l-6 flex items-center p-4 border-b border-gray-200
                      ${key === 0 ? "rounded-tl-lg" : ""}
                      ${key === array.length - 1 ? "rounded-bl-lg border-b-transparent" : ""}
                      ${prop.status === "active" 
                        ? "border-l-yellow-400 bg-yellow-50" 
                        : prop.status === "completed" 
                          ? "border-l-[#00B69B] bg-green-50" 
                          : "border-l-gray-300"}`}
                  >
                    <span className="text-gray-900 p-2 inline-block">{prop.icon}</span>
                    <span className="font-medium">{category}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mb-3">
                <button
                  className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                    activeIndex === 0 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                  disabled={activeIndex === 0}
                  onClick={() => handleNavigation("prev")}
                >
                  Previous
                </button>
                {activeIndex === categoryKeys.length - 1 ? (
                  <button
                    className="rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm px-6 py-2 transition-colors"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Finish"}
                  </button>
                ) : (
                  <button
                    className="rounded-lg bg-yellow-400 hover:bg-yellow-500 text-sm px-6 py-2 transition-colors"
                    disabled={activeIndex === categoryKeys.length - 1}
                    onClick={() => handleNavigation("next")}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="grid grid-cols-2 gap-6 items-start h-full">
                {
                  {
                    "Internship Details": (
                      <InternshipDetails formData={formData} setFormData={setFormData} />
                    ),
                    "Internship Requirements": (
                      <InternshipRequirements formData={formData} setFormData={setFormData} />
                    ),
                    "Application Process": (
                      <ApplicationProcess formData={formData} setFormData={setFormData} />
                    ),
                    Summary: (
                      <InternshipPreview formData={formData} setFormData={setFormData} />
                    ),
                  }[
                    Object.entries(categories).find(
                      ([_, prop]) => prop.status === "active"
                    )?.[0]
                  ]
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InternPostForm;
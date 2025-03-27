import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Footer from "../../components/Common/Footer";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { RiEdit2Fill } from "react-icons/ri";


import {
  FaBook,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUserTie,
  FaCalendarAlt,
  FaBuilding,
  FaClock,
  FaFileAlt,
  FaClipboardList,
  FaRegCalendarAlt,
  FaLightbulb,
  FaBookmark,
  FaPlus,
  FaCheck,
  FaListOl,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaTrash,
} from "react-icons/fa";
import { TbCalendarClock } from "react-icons/tb";
import placeholderImage from "../../assets/images/Exam.png"; // Placeholder image
import ApplicationCard from "../../components/Students/ApplicationCard"; // Reusing ApplicationCard for exams
import GridLines from "../../assets/images/Grid Lines.png";

// Format date utility function
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const ExamPreview = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [userId, setUserId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [savedExams, setSavedExams] = useState([]);
  const [publishedExams, setPublishedExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.student_user) {
          setUserId(payload.student_user);
        }
        setUserRole(payload.role || "student"); // Default to "student" if no role
      } catch (error) {
        console.error("Invalid JWT token:", error);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/exam/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setExam(data.exam);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching exam:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const fetchPublishedExams = async () => {
      setLoadingExams(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/published-exams/` // Adjust endpoint as needed
        );

        const examsData = Array.isArray(response.data)
          ? response.data
          : response.data.exams || response.data.data || [];

        const currentExamId = id;
        const filteredExams = examsData.filter((exam) => {
          const examId = exam._id || exam.id;
          return examId !== currentExamId;
        });
        setPublishedExams(filteredExams);
        setLoadingExams(false);
      } catch (error) {
        console.error("Error fetching published exams:", error);
        setLoadingExams(false);
      }
    };

    fetchPublishedExams();
  }, [id]);

  const handleEditClick = () => {
    navigate("/exam-post", { state: { exam, id } }); // Navigate to job post page with job details
  };

  const handleDeleteClick = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this exam? This action cannot be undone."
      )
    ) {
      try {
        const token = Cookies.get("jwt");
        if (!token) {
          toast.error("No token found. Please log in.");
          return;
        }
        const response = await axios.delete(
          `${API_BASE_URL}/api/exam-delete/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Exam deleted successfully!"); // Success toast
        navigate("/exams"); // Redirect after 2 seconds
      } catch (error) {
        console.error("Error deleting exam:", error);
        toast.error(
          `Error deleting exam: ${
            error.response?.data?.error || "Something went wrong"
          }`
        );
      }
    }
  };

  const handleApplyClick = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post(`${API_BASE_URL}/api/apply-exam/`, {
        studentId: userId,
        examId: id,
      });
      setShowApplySuccess(true);

      // Get the exam link from the exam data
      const examLink = exam.exam_data.exam_link;

      setTimeout(() => {
        setShowApplySuccess(false);
        // Check if there's a valid exam link
        if (examLink && examLink.trim() !== '') {
          // If the link doesn't start with http:// or https://, add https://
          const formattedLink = examLink.match(/^https?:\/\//) ? 
            examLink : 
            `https://${examLink}`;
          window.open(formattedLink, "_blank", "noopener noreferrer");
        } else {
          toast.warning("Exam application link is not available");
        }
      }, 2000);
    } catch (error) {
      console.error("Error applying for exam:", error);
      toast.error("Error applying for exam. Please try again.");
    }
  };

  const handleSaveExam = async () => {
    try {
      if (!userId) {
        console.error("User ID is not available");
        return;
      }
  
      const endpoint = saved
        ? `${API_BASE_URL}/api/unsave-exam/${id}/`
        : `${API_BASE_URL}/api/save-exam/${id}/`;
  
      const response = await axios.post(endpoint, { userId });
  
      if (response.status === 200) {
        const updatedExams = saved
          ? savedExams.filter((examId) => examId !== id)
          : [...savedExams, id];
  
        setSavedExams(updatedExams);
        setSaved(!saved);
        setShowSaveSuccess(true);
  
        setTimeout(() => {
          setShowSaveSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving/unsaving exam:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      toast.error("Error saving exam. Please try again.");
    }
  };
  
  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };
  const handleCardClick = (examId) => {
    window.location.href = `/exam-preview/${examId}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {userRole === "admin" && <AdminPageNavbar />}
        {userRole === "superadmin" && <SuperAdminPageNavbar />}
        {userRole === "student" && <StudentPageNavbar />}
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {userRole === "admin" && <AdminPageNavbar />}
        {userRole === "superadmin" && <SuperAdminPageNavbar />}
        {userRole === "student" && <StudentPageNavbar />}
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <FaInfoCircle className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Exam Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The exam you're looking for could not be found or may have been
              removed.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ImageModal = ({ imageSrc, onClose }) => {
    const handleDownload = () => {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = imageSrc;
      link.download = 'image.jpg'; // Set the default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
        <div className="relative w-3/4 h-3/4 max-w-4xl max-h-4xl">
          <button
            className="absolute top-4 right-4 text-white text-3xl bg-gray-800 rounded-full p-2"
            onClick={onClose}
          >
            &times;
          </button>
          <img src={imageSrc} alt="Preview" className="w-full h-full object-contain rounded-lg" />
          <button
            onClick={handleDownload}
            className="absolute right-4 left-1/2 transform -translate-x-1/2 text-black bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-lg"
          >
            Download
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {userRole === "student" && <StudentPageNavbar />}

      {showApplySuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Redirecting...
        </div>
      )}

      {showSaveSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          {saved ? "Exam saved successfully!" : "Exam unsaved !"}
        </div>
      )}

      <div
        className={`flex-grow p-4  sm:p-6 max-w-8xl mx-auto w-screen ${
          userRole === "admin" || userRole === "superadmin" ? "lg:ml-70 lg:max-w-7xl" : ""
        }`}
      >
        {/* Exam Overview Card */}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Exam Details */}
          <div
            className={`space-y-6 w-full ${
              userRole === "student" ? "lg:w-[70%]" : "lg:w-full"
            }`}
          >
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 border border-gray-100 ">
              <div className="flex flex-col  ">
                {/* Left Column - Exam Image */}
                <div
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255, 230, 141, 0.28), rgba(255, 204, 0, 0.25))",
                  }}
                  className="md: p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 flex items-center justify-center"
                >
                  <img
                    src={
                      exam.exam_data.image
                        ? `data:image/jpeg;base64,${exam.exam_data.image}`
                        : placeholderImage
                    }
                    alt={`${exam.exam_data.exam_title} image`}
                    className="max-w-full max-h-80 object-contain rounded-lg"
                    onClick={() => setIsModalOpen(true)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                  />
                </div>

                {/* Right Column - Exam Summary */}
                <div className="md: p-6 relative">
                  <img
                    src={GridLines}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ height: "210%" }}
                  />

                  <div className="relative z-10 flex justify-between items-start">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                      {truncateString(exam.exam_data.exam_title, 25)}
                    </h1>
                  </div>

                  <p className="relative z-10 text-lg sm:text-xl text-gray-600 mb-4 flex items-center">
                    {exam.exam_data.about_exam}
                  </p>

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-700">
                        {" "}
                        Exam Center :{" "}
                      </span>{" "}
                      <span className="ml-4 text-gray-700">
                        {" "}
                        {exam.exam_data.exam_centers}
                      </span>
                    </div>
                    {/* <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FaGraduationCap className="text-gray-600" />
                  </div>
                  <span className="text-gray-700">{exam.exam_data.eligibility_criteria}</span>
                </div> */}
                    <div className="flex items-center">
                      <span className="font-bold text-gray-700">
                        Application Deadline : </span>  <span className="ml-4 text-gray-700">   {exam.exam_data.application_deadline || "TBD"}
                      </span>
                    </div>

                    {/* <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FaClock className="text-gray-600" />
                  </div>
                  <span className="text-gray-700">{exam.exam_data.exam_pattern}</span>
                </div> */}
                  </div>

                  <div className="relative z-10 flex flex-wrap gap-4">
                    {userRole === "student" ? (
                      <>
                        <button
                          onClick={handleApplyClick}
                          title={
                            userRole !== "student"
                              ? "Only students can apply for jobs"
                              : ""
                          }
                          className={`bg-yellow-500 ${
                            userRole === "student"
                              ? "hover:bg-yellow-600"
                              : "opacity-60 cursor-not-allowed"
                          } 
                                    text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out 
                                    flex items-center shadow-md ${
                                      userRole === "student" && "hover:shadow-lg"
                                    }`}
                        >
                          Apply Now <FaExternalLinkAlt className="ml-2 text-sm" />
                        </button>
                        <button
                            onClick={userRole === "student" ? handleSaveExam : undefined}
                            className={`${
                                saved
                                    ? "bg-gray-100 text-gray-800"
                                    : "border-2 border-gray-300 text-gray-700"
                            } 
                            font-semibold py-3 px-8 rounded-lg 
                            ${userRole === "student" ? "hover:bg-gray-100" : "opacity-60 cursor-not-allowed"}
                            transition duration-300 ease-in-out flex items-center justify-center`}
                            title={userRole !== "student" ? "Only students can save exams" : ""}
                        >
                            {saved ? (
                                <>
                                    Saved <FaBookmark className="ml-2 text-yellow-500" />
                                </>
                            ) : (
                                <>
                                    Save Exam <FaBookmark className="ml-2" />
                                </>
                            )}
                        </button>
                      </>
                    ) : null}
                  </div>
                  <div className="relative z-10 flex flex-wrap gap-4 ">
                    {(userRole === "admin" || userRole === "superadmin") && (
                      <>
                        <button
                          onClick={handleEditClick}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out flex items-center shadow-md hover:shadow-lg"
                        >
                          <RiEdit2Fill className="mr-2" />
                          Edit Exam
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="bg-gray-100 hover:bg-gray-300 text-black font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out flex items-center shadow-md hover:shadow-lg"
                        >
                          Delete 
                          <FaTrash className="ml-2" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* About Exam Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaBook className="text-yellow-600" />
                  </div>
                  About Exam
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                  {exam.exam_data.about_exam}
                </p>
              </div>
            </div>

            {/* Eligibility Criteria Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaGraduationCap className="text-yellow-600" />
                  </div>
                  Eligibility Criteria
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                  {exam.exam_data.eligibility_criteria}
                </p>
              </div>
            </div>

            {/* Application Process Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaFileAlt className="text-yellow-600" />
                  </div>
                  Application Process
                </h2>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-white p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                      <FaListOl className="mr-2 text-yellow-600" />
                      Application Steps
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                      {exam.exam_data.application_process}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-white p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                      <FaFileAlt className="mr-2 text-blue-600" />
                      Documents Required
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {Array.isArray(exam.exam_data.documents_required)
                        ? exam.exam_data.documents_required.map((doc, index) => (
                          <li key={index} className="pl-2">{doc.trim()}</li>
                        ))
                        : exam.exam_data.documents_required
                          ?.split(",")
                          .map((doc, index) => (
                            <li key={index} className="pl-2">{doc.trim()}</li>
                          ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Pattern Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaListOl className="text-yellow-600" />
                  </div>
                  Exam Pattern
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                  {exam.exam_data.exam_pattern}
                </p>
              </div>
            </div>

            {/* Syllabus Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaBook className="text-yellow-600" />
                  </div>
                  Syllabus
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                  {exam.exam_data.syllabus}
                </p>
              </div>
            </div>

            {/* Application Deadline Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaRegCalendarAlt className="text-yellow-600" />
                  </div>
                  Application Deadline
                </h2>
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="flex items-center font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      <TbCalendarClock className="inline-block mr-1 text-gray-500" />
                      Application Start:
                    </div>
                    <div className="text-red-600 font-bold w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {formatDate(
                        exam.exam_data.application_start_date || exam.updated_at
                      )}
                    </div>
                  </div>
                  {/* <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      Application Deadline:
                    </div>
                    <div className="text-red-600 font-medium w-full sm:w-2/3 bg-red-50 p-2 rounded border border-red-100">
                      {formatDate(exam.exam_data.application_deadline || "TBD")}
                    </div>
                  </div> */}
                  <div className="flex flex-col sm:flex-row sm:items-center py-2">
                    <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                      Application Deadline:
                    </div>
                    <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                      {exam.exam_data.application_deadline || "TBD"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Centers Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaMapMarkerAlt className="text-yellow-600" />
                  </div>
                  Exam Centers
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                  {exam.exam_data.exam_centers}
                </p>
              </div>
            </div>

            {/* Preparation Tips Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaLightbulb className="text-yellow-600" />
                  </div>
                  Preparation Tips
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                  {exam.exam_data.preparation_tips}
                </div>
              </div>
            </div>

            {/* Apply Now Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 py-2 border-b flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaFileAlt className="text-yellow-600" />
                  </div>
                  Ready to Apply?
                </h2>
                <p className="text-gray-600 mb-4">
                  Don’t miss this opportunity! Apply before the deadline.
                </p>
                <div className="flex gap-4">
                  <div className="relative group">
                    <button
                      onClick={
                        userRole === "student" ? handleApplyClick : undefined
                      }
                      className={`w-auto bg-yellow-500 ${
                        userRole === "student"
                          ? "hover:bg-yellow-600"
                          : "opacity-60 cursor-not-allowed"
                      } text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center shadow-md ${
                        userRole === "student" && "hover:shadow-lg"
                      }`}
                      title={
                        userRole !== "student"
                          ? "Only students can apply for Exam"
                          : ""
                      }
                    >
                      Apply Now <FaExternalLinkAlt className="ml-2 text-sm" />
                    </button>
                  </div>
                  <button
                    onClick={userRole === "student" ? handleSaveExam : undefined}
                    className={`${
                      saved
                        ? "bg-gray-100 text-gray-800"
                        : "border-2 border-gray-300 text-gray-700"
                    } 
                    font-semibold py-3 px-6 rounded-lg 
                    ${userRole === "student" ? "hover:bg-gray-100" : "opacity-60 cursor-not-allowed"}
                    transition duration-300 ease-in-out flex items-center justify-center`}
                    title={userRole !== "student" ? "Only students can save exams" : ""}
                  >
                    {saved ? (
                      <>
                        Saved <FaBookmark className="ml-2 text-yellow-500" />
                      </>
                    ) : (
                      <>
                        Save Exam <FaBookmark className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Other Exams (for students only) */}
          {userRole === "student" && (
            <div className="w-full lg:w-[35%] space-y-4">
              <div className="bg-transparent rounded-lg overflow-hidden border border-gray-100 lg:sticky lg:top-20">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-full mr-2">
                      <FaBook className="text-yellow-600" />
                    </div>
                    Other Exams
                  </h2>
                </div>

                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto lg:space-y-4">
                  {loadingExams ? (
                    <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div
                          key={item}
                          className="bg-gray-100 h-32 w-full min-w-[90%] sm:min-w-[300px] lg:min-w-0 rounded-lg flex-shrink-0 lg:flex-shrink"
                        ></div>
                      ))}
                    </div>
                  ) : publishedExams.length > 0 ? (
                    <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 snap-x snap-mandatory">
                      {publishedExams.map((exam) => {
                        const examId = exam._id || exam.id;
                        const examTitle =
                          exam.exam_data?.exam_title ||
                          exam.title ||
                          "Exam Title";
                        const aboutExam =
                          exam.exam_data?.about_exam || exam.description || "";
                        const location =
                          exam.exam_data?.exam_centers || "Multiple Locations";
                        const updatedAt =
                          exam.updated_at || new Date().toISOString();
                        const status = exam.status || "Active";
                        const views = exam.views || 0;

                        return (
                          <div
                            key={examId}
                            className="w-full min-w-[100%] sm:min-w-[300px] lg:min-w-0 flex-shrink-0 lg:flex-shrink snap-start"
                          >
                            <ApplicationCard
                              application={{
                                id: examId,
                                title: examTitle,
                                company_name: "Exam Board", // Placeholder, adjust as needed
                                location: location,
                                job_description: aboutExam,
                                updated_at: updatedAt,
                                status: status,
                                total_views: views,
                                type: "exam",
                              }}
                              handleCardClick={() => handleCardClick(examId)}
                              small={true}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No other exams found. Please check the API response.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {isModalOpen && (
            <ImageModal
              imageSrc={
                exam.exam_data.image
                  ? `data:image/jpeg;base64,${exam.exam_data.image}`
                  : placeholderImage
              }
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </div>
      {userRole === "student" && <Footer />}
    </div>
  );
};

export default ExamPreview;

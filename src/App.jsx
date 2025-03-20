import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./App.css";
import StudentLogin from "./pages/students/StudentLogin";
import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import InternShipDashboard from "./pages/common/InternshipDashboard";
import JobDashboard from "./pages/common/JobDashboard";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard";
import MailPage from "./pages/superadmin/Management";
import JobPostForm from "./pages/admin/JobPostForm";
import AchievementPostForm from "./pages/admin/AchievementPostForm";
import InternshipForm from "./pages/admin/IntershipForm";
import AchievementDashboard from "./pages/common/AchievementDashboard";
import HomeDashboard from "./pages/students/HomeDashboard";
import LandingPage from "./pages/common/Landing";
import ContactForm from "./pages/students/Contact";
import JobPreview from "./pages/students/Jobpreview";
import JobEdit from "./pages/admin/Jobedit";
import InternshipEdit from "./pages/admin/InternshipEdit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InternshipPreview from "./pages/students/InternshipPreview";
import SuperAchievementDashboard from "./pages/superadmin/superAchievementDashboard";
import ManageJobs from "./pages/admin/ManageJobs";
import InboxPage from "./pages/superadmin/InboxPage";
import AdminHome from "./pages/admin/AdminHomePage";
import AdminSignup from "./pages/superadmin/AdminSignup";
import StudentSignup from "./pages/superadmin/StudentSignup";
import AdminManagement from "./pages/superadmin/AdminManagement";
import AdminDetailPage from "./pages/superadmin/AdminDetailPage";
import AdminMail from "./pages/admin/AdminMail";
import StudentManagement from "./pages/admin/StudentManagement";
import StudentAchievementPostForm from "./pages/students/PostAchievement";
import StudyMaterialForm from "./components/Common/StudyMaterialForm"
import StudyEdit from "./pages/admin/StudyEdit";
import Profile from "./pages/common/profile";
import SavedJobs from './pages/students/SavedJobs';
import StudentStudyMaterial from "./pages/students/StudentStudyMaterial";
import AppliedJobs from "./pages/students/AppliedJobs"; import AchivementEdit from "./pages/admin/AchivementEdit";
import StudentMail from "./pages/students/StudentMail";
import AchievementPreview from "./pages/students/AchievementPreview";
import { LoaderContext, LoaderLayout } from "./components/Common/Loader";
import { useState } from "react";
import JobEntrySelection from "./pages/admin/JobEntrySelection";
import InternshipEntrySelection from "./pages/admin/InternshipEntrySelection";
import Message from "./pages/superadmin/Message";
import StudentStudyDetail from './pages/students/StudentStudyDetail';
import ExamPostForm from "./pages/superadmin/ExamPostForm";
import ExamDashboard from "./pages/common/ExamDashboard";
import AdminInbox from "./pages/admin/Admininbox";
import ExamPreview from "./pages/students/ExamPreview";
import StudentRegister from "./pages/superadmin/StudentRegister";



export const base_url = import.meta.env.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL || "http://localhost:8000";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("jwt"); // Get JWT token from cookies

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to login if no token
  }
  return children; // Render the protected page if token exists
};

function App() {

  const [isLoading, setIsLoading] = useState(false)

  return (
    <BrowserRouter>
      {/* Add ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // Automatically close toasts after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Optional: Adjust theme as per your design
      />
      <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
        <LoaderLayout />
        <Routes>
          <Route path={"/"} element={<LandingPage />} />


          {/* Student Routes */}
          <Route path="/student" element={<StudentLogin />} />
          <Route path="/achievement-preview/:id" element={<AchievementPreview />} />

        {/* Protected Student Routes */}
        <Route path="/home" element={<ProtectedRoute> <HomeDashboard /> </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path="/achievements" element={ <ProtectedRoute> <AchievementDashboard /> </ProtectedRoute>} />
        <Route path="/contact" element= {<ProtectedRoute><ContactForm /> </ProtectedRoute>} />
        <Route path="/student/mail" element={<ProtectedRoute> <StudentMail /> </ProtectedRoute>} />
        <Route path="/job-preview/:id" element={<JobPreview />} />
        <Route path="/internship-preview/:id" element={<InternshipPreview />} />
      
        <Route path="/studentachievement" element= {<ProtectedRoute><StudentAchievementPostForm /> </ProtectedRoute>} />
        <Route path="/saved-jobs" element={<ProtectedRoute> <SavedJobs /> </ProtectedRoute>} />
        <Route path="/study-material" element={<ProtectedRoute> <StudentStudyMaterial /> </ProtectedRoute>} />        
        <Route path="/applied-jobs" element={<ProtectedRoute> <AppliedJobs /> </ProtectedRoute>} />
        <Route path="/student-study-detail/:id" element={<ProtectedRoute> <StudentStudyDetail /> </ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/studentbulksignup" element={<StudentRegister />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/home" element={<ProtectedRoute> <AdminHome /> </ProtectedRoute>} />
          <Route path="/admin/mail" element={<ProtectedRoute> <AdminMail /> </ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute> <JobDashboard /> </ProtectedRoute>} />
          <Route path="/internships" element={<ProtectedRoute> <InternShipDashboard /></ProtectedRoute>} />
          <Route path="/jobselection" element={<ProtectedRoute> <JobEntrySelection /> </ProtectedRoute>} />
          <Route path="/jobpost" element={<ProtectedRoute> <JobPostForm /> </ProtectedRoute>} />
          <Route path="/achievementpost" element={<ProtectedRoute> <AchievementPostForm /> </ProtectedRoute>} />
          <Route path="/internpost" element={<ProtectedRoute> <InternshipForm /> </ProtectedRoute>} />
          <Route path="/job-edit/:id" element={<ProtectedRoute> <JobEdit /> </ProtectedRoute>} />
          <Route path="/internship-edit/:id" element={<ProtectedRoute> <InternshipEdit /> </ProtectedRoute>} />
          <Route path="/achievement-edit/:id" element={<ProtectedRoute> <AchivementEdit /> </ProtectedRoute>} />
          <Route path="//study-edit/:id" element={<ProtectedRoute> <StudyEdit /> </ProtectedRoute>} />
          <Route path="/manage-jobs" element={<ProtectedRoute> <ManageJobs /> </ProtectedRoute>} />
          <Route path="/manage-student" element={<ProtectedRoute> <StudentManagement /> </ProtectedRoute>} />
          <Route path="/studymaterial-post" element={<ProtectedRoute> <StudyMaterialForm /> </ProtectedRoute>} />
          <Route path="/internshipselection" element={<ProtectedRoute> <InternshipEntrySelection /> </ProtectedRoute>} />


          {/* Super Admin Login */}
          <Route path={"/superadmin"} element={<SuperAdminLogin />} />
          <Route path={"/admin-signup"} element={<AdminSignup />} />
          <Route path={"/student-signup"} element={<StudentSignup />} />
          <Route path={"/superadmin-dashboard"} element={<ProtectedRoute> <SuperadminDashboard /> </ProtectedRoute>} />
          <Route path={"/Admin-Management"} element={<ProtectedRoute> <AdminManagement /> </ProtectedRoute>} />
          <Route path={"/admin-achievements"} element={<ProtectedRoute> <SuperAchievementDashboard /> </ProtectedRoute>} />
          <Route path={"/superadmin-manage-jobs"} element={<ProtectedRoute> <MailPage /> </ProtectedRoute>} />
          <Route path={"/contact-inbox"} element={<ProtectedRoute> <InboxPage /> </ProtectedRoute>} />
          <Route path={"/admin-details/:id"} element={<ProtectedRoute> <AdminDetailPage /> </ProtectedRoute>} />
          <Route path={"/message"} element={<ProtectedRoute> <Message /> </ProtectedRoute>} />
          <Route path={"/exam-post"} element={<ProtectedRoute> <ExamPostForm /> </ProtectedRoute>} />
          <Route path={"/exams"} element={<ProtectedRoute> <ExamDashboard /> </ProtectedRoute>} />
          <Route path={"/exam-preview/:id"} element={<ProtectedRoute> <ExamPreview /> </ProtectedRoute>} />
          
          
        </Routes>
      </LoaderContext.Provider>
    </BrowserRouter>
  );
}

export default App;

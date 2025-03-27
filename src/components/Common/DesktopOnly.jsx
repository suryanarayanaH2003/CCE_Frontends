import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

  
const DesktopOnly = () => {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserRole(payload.role);
          }
    }, []);
  return (
    <div className="fixed h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-200 top-0 left-0 flex flex-col items-center justify-center z-[9999] lg:hidden">
        {/* {userRole === "admin" && <AdminPageNavbar />}
        {userRole === "superadmin" && <SuperAdminPageNavbar />} */}

      {/* Icon or Illustration */}
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75L7.5 12l2.25 2.25m4.5 0L16.5 12l-2.25-2.25M3.75 12a8.25 8.25 0 1116.5 0 8.25 8.25 0 01-16.5 0z"
          />
        </svg>
      </div>

      {/* Message */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Desktop View Only
        </h1>
        <p className="text-gray-600">
          This page is only accessible in desktop view. <br />
          Please switch to desktop view for the best experience.
        </p>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg"
      >
        Back
      </button>
    </div>
  );
};

export default DesktopOnly;

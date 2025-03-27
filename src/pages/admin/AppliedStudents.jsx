import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Pagination from "../../components/Admin/pagination";
import { Button } from "../../components/ui/button";

const AppliedStudents = () => {
  const { entityType, entityId } = useParams(); // Get entityType and entityId from the URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.student_user) {
            setUserId(payload.student_user);
            }
            if (payload.role) {
            setUserRole(payload.role);
            } else {
            setUserRole("student");
            }
        } catch (error) {
            console.error("Invalid JWT token:", error);
        }
        }
    }, []);

  useEffect(() => {
    // Fetch applied students
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/applied-students/${entityType}/${entityId}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.students);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [entityType, entityId]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageItems = students.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadCSV = () => {
    const headers = ["Name", "Department", "Year", "College Name", "Email", "Mobile Number"];
    const csvContent = [
      headers.join(","),
      ...students.map((student) => [
        student.name,
        student.department,
        student.year,
        student.college_name,
        student.email,
        student.mobile_number,
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "applied_students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen w-full">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1 bg-gray-50 overflow-x-hidden">
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <h1 className="text-2xl font-semibold mb-6">
            {`Applied Students for ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`}
          </h1>
          {loading ? (
            <p>Loading...</p>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="bg-white rounded-lg shadow">
                <div className="w-full">
                  <table className="w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          College Name
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mobile Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentPageItems.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            {student.department}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            {student.year}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            {student.college_name}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            {student.email}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                            {student.mobile_number}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination and Download Button */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 items-center w-full">
                <div className="col-span-1 hidden md:block"></div>
                <div className="col-span-1 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={students.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={paginate}
                  />
                </div>
                <div className="col-span-1 flex justify-center md:justify-end">
                  <Button
                    onClick={downloadCSV}
                    variant="outline"
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs md:text-sm"
                  >
                    Download CSV
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p>No students have applied yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedStudents;
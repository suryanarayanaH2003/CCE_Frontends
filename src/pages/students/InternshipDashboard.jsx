import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import { AppPages } from "../../utils/constants";
import ApplicationCard from "../../components/Students/ApplicationCard";

export default function InternshipDashboard() {
  const [internships, setInternships] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://cce-backend.onrender.com";

  // Fetch published internships from the backend
  useEffect(() => {
    const fetchPublishedInternships = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/published-internship/`);
        const internshipsWithType = response.data.internships.map((internship) => ({
          ...internship.internship_data, // Extract internship_data
          id: internship._id, // Add id field
          type: "internship", // Add type field
        }));
        setInternships(internshipsWithType); // Set internships with type
        setFilteredInterns(internshipsWithType); // Update filtered internships
      } catch (err) {
        console.error("Error fetching published internships:", err);
        setError("Failed to load internships.");
      }
    };

    fetchPublishedInternships();
  }, [backendUrl]);

  useEffect(() => {
    if (searchPhrase === "") {
      setFilteredInterns(internships);
    } else {
      setFilteredInterns(
        internships.filter(
          (intern) =>
            intern.title.includes(searchPhrase) ||
            intern.company_name.includes(searchPhrase) ||
            intern.job_description.includes(searchPhrase) ||
            intern.required_skills.includes(searchPhrase) ||
            intern.internship_type.includes(searchPhrase)
        )
      );
    }
  }, [searchPhrase, internships]);

  return (
    <div className="flex flex-col">
      <StudentPageNavbar />
      <PageHeader
        page={AppPages.internShipDashboard}
        filter={filter}
        setFilter={setFilter}
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
      />

      {/* Internship cards */}
      <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : internships.length === 0 ? (
          <p className="text-gray-600">No internships available at the moment.</p>
        ) : filteredInterns.length === 0 ? (
          <p className="alert alert-danger w-full col-span-full text-center">
            !! No Internships Found !!
          </p>
        ) : (
          filteredInterns.map((intern) => (
            <ApplicationCard key={intern.id} application={{ ...intern }} />
          ))
        )}
      </div>
    </div>
  );
}

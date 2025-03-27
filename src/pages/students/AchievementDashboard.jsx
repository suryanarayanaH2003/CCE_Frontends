import { useEffect, useState, useContext } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { LoaderContext } from "../../components/Common/Loader"; // Import Loader Context

export default function AchievementDashboard() {
  const [achievements, setAchievements] = useState([]);
  const [error, setError] = useState("");
  const { isLoading, setIsLoading } = useContext(LoaderContext); // Use Loader Context

  useEffect(() => {
    const fetchPublishedAchievements = async () => {
      setIsLoading(true); // Show loader when fetching data
      try {
        const response = await axios.get("https://cce-backend.onrender.com/api/published-achievement/");
        setAchievements(response.data.achievements);
      } catch (err) {
        console.error("Error fetching published achievements:", err);
        setError("Failed to load achievements.");
      } finally {
        setIsLoading(false); // Hide loader after data fetch
      }
    };

    fetchPublishedAchievements();
  }, [setIsLoading]);

  return (
    <div className="flex flex-col">
      <StudentPageNavbar />

      {/* Loader Display */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-semibold text-gray-700">Loading Achievements...</p>
        </div>
      ) : (
        <>
          <div className="text-center my-6 py-14">
            <h1 className="text-6xl tracking-[0.8px]">Achievement</h1>
            <p className="text-lg mt-2 text-center">Explore all the opportunities in all the existing fields around the globe.</p>
          </div>

          <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : achievements.length === 0 ? (
              <p className="text-gray-600">No achievements available at the moment.</p>
            ) : (
              achievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="p-6 border-gray-900 rounded-xl shadow-lg bg-white flex flex-col items-center relative transition-transform duration-300 hover:scale-109 hover:shadow-xl"
                >
                  {achievement.photo && (
                    <img
                      src={`data:image/jpeg;base64,${achievement.photo}`}
                      alt="Achievement"
                      className="w-24 h-24 object-cover rounded-full border-4 border-gray-300 shadow-md"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-900 mt-4">{achievement.name}</h2>
                  <p className="text-gray-600 text-sm">{achievement.achievement_type}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">{achievement.company_name}</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Batch: {achievement.batch}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">{achievement.achievement_description}</p>
                  <p className="text-gray-500 text-sm mt-2">Date: {new Date(achievement.date_of_achievement).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
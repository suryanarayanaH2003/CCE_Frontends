import { useState, useEffect, useContext, useMemo, useRef } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { motion, useInView } from "framer-motion";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { LoaderContext } from "../../components/Common/Loader";
import Squares from "../../components/ui/GridLogin";
import Pagination from "../../components/Admin/pagination";
import Footer from "../../components/Common/Footer";

export default function AchievementDashboard() {
  // State management
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [error, setError] = useState("");
  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const [carouselFilter, setCarouselFilter] = useState("");
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const carouselRef = useRef(null);
  // const carouselControls = useAnimationControls(); // Not needed anymore
  const carouselInView = useRef(null);
  const isInView = useInView(carouselInView);

  // Fetch data
  useEffect(() => {
    const fetchPublishedAchievements = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/published-achievement/`
        );
        const sortedAchievements = response.data.achievements.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setAchievements(sortedAchievements);
        setFilteredAchievements(sortedAchievements);
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching published achievements:", err);
        setError("Failed to load achievements.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedAchievements();
  }, [setIsLoading]);

  const filters = [
    "Internship",
    "Job Placement",
    "Certification",
    "Exam Cracked",
  ];

  // Filter logic
  useEffect(() => {
    let filtered = achievements;

    if (selectedFilter) {
      filtered = filtered.filter(
        (achievement) => achievement.achievement_type === selectedFilter
      );
    }
    if (selectedCompany) {
      filtered = filtered.filter((achievement) =>
        achievement.company_name
          .toLowerCase()
          .includes(selectedCompany.toLowerCase())
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((achievement) =>
        achievement.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAchievements(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedFilter, selectedCompany, searchQuery, achievements]);

  // Mobile detection and itemsPerPage adjustment
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setItemsPerPage(mobile ? 5 : 8);

      // Check if there are any starred achievements
      const starredAchievements = achievements.filter(
        (achievement) => achievement.starred === true
      );
      if (starredAchievements.length === 0) {
        console.warn("No starred achievements found");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [achievements]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAchievements = filteredAchievements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Recent achievements for carousel
  const recentAchievements = useMemo(() => {
    let filtered = achievements
      .filter((achievement) => achievement.starred === true)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    if (carouselFilter) {
      filtered = filtered.filter(
        (achievement) => achievement.achievement_type === carouselFilter
      );
    }
    // Get up to 8 items for a better loop
    let items = filtered.slice(0, 8);

    // If we have less than 2 items, return an empty array to avoid errors
    if (items.length < 2) {
      return [];
    }

    // If we have 2 to 7 items, duplicate them to create a continuous effect
    if (items.length < 8) {
      const multiplier = Math.ceil(8 / items.length);
      items = Array(multiplier).fill(items).flat().slice(0, 8);
    }

    return items;
  }, [achievements, carouselFilter]);

  // Continuous carousel animation - we're not using this anymore as we've implemented
  // a more direct approach with the duplicated content above
  useEffect(() => {
    // Animation is now handled directly in the JSX with motion.div
    // This effect is kept for reference but doesn't do anything now
  }, [recentAchievements.length, isCarouselPaused, isInView]);

  // Pause animation on hover
  const handleMouseEnter = () => setIsCarouselPaused(true);
  const handleMouseLeave = () => setIsCarouselPaused(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Add this helper function before the return statement
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background */}
      <div className="h-full w-full absolute top-0 left-0 z-[-5]">
        <Squares
          speed={0.1}
          squareSize={isMobile ? 20 : 40}
          direction="diagonal"
          borderColor="#FCF55F"
          hoverFillColor="#ffcc00"
        />
      </div>

      <StudentPageNavbar transparent={true} />

      {/* Header Section */}
      <div className="text-center my-4 md:my-6 py-2 md:py-4 relative px-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.8px] font-bold mt-15">
          <span className="">Celebrating</span>
          <span className="text-[#ffcc00]"> Student Excellence,</span>
          <br className="hidden md:inline" />
          <span>Inspiring Achievements!</span>
        </h1>
      </div>

      {/* Featured Achievements Carousel - Enhanced with Continuous Marquee Effect */}
      <div
        ref={carouselInView}
        className="w-full py-4 md:py-2 relative overflow-hidden from-amber-50 via-white to-amber-50"
      >
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-1">
            <h2 className="text-2xl font-bold">
              {/* <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400">
          Featured Achievements
        </span> */}
            </h2>
          </div>
          {error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : recentAchievements.length === 0 ? (
            <p className="text-gray-600 text-center w-full">
              No starred achievements available at the moment.
            </p>
          ) : (
            <div
              className="relative overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex space-x-4 marquee-container">
                <motion.div
                  className="flex space-x-4 marquee-content"
                  animate={{
                    x: isCarouselPaused ? 0 : "-100%",
                  }}
                  transition={{
                    ease: "linear",
                    duration: 100,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                >
                  {recentAchievements.map((achievement, index) => (
                    <motion.div
                      key={`${achievement._id}-${index}`}
                      className="flex-shrink-0 w-[280px] md:w-[320px]"
                      whileHover={{ y: -8, scale: 1.03 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full md:h-[450px] border border-gray-100">
                        <div className="relative h-full">
                          {achievement.photo ? (
                            <img
                              src={`data:image/jpeg;base64,${achievement.photo}`}
                              alt={achievement.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-yellow-500 flex items-center justify-center text-4xl font-bold text-white">
                              {getInitials(achievement.name)}
                            </div>
                          )}

                          {/* White overlay for information - fixed height */}
                          <div className="absolute bottom-3 left-3 right-3 bg-white p-2 rounded-lg h-26 overflow-hidden">
                            <div className="flex flex-col h-full">
                              <h3 className="text-sm font-bold text-gray-800 truncate">
                                {achievement.name}{" "}
                                <span className="text-red-500 text-sm font-normal ml-1">
                                  {achievement.batch}
                                </span>
                              </h3>
                              <div className="text-yellow-500 text-sm my-1">
                                {achievement.achievement_type && (
                                  <span className="truncate block">
                                    {achievement.achievement_type}
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex-1 overflow-hidden">
                                <p className="text-gray-500 text-sm line-clamp-3">
                                  {achievement.achievement_description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                {/* Duplicate the content for seamless looping */}
                <motion.div
                  className="flex space-x-4 marquee-content"
                  animate={{
                    x: isCarouselPaused ? 0 : "-100%",
                  }}
                  transition={{
                    ease: "linear",
                    duration: 200,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                >
                  {recentAchievements.map((achievement, index) => (
                    <motion.div
                      key={`${achievement._id}-duplicate-${index}`}
                      className="flex-shrink-0 w-[280px] md:w-[350px]"
                      whileHover={{ y: -8, scale: 1.03 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full md:h-[450px]  border border-gray-100">
                        <div className="relative h-full">
                          {achievement.photo ? (
                            <img
                              src={`data:image/jpeg;base64,${achievement.photo}`}
                              alt={achievement.name}
                              className="w-full h-full object-scale-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-yellow-500 flex items-center justify-center text-4xl font-bold text-white">
                              {getInitials(achievement.name)}
                            </div>
                          )}

                          {/* White overlay for information - fixed height */}
                          <div className="absolute bottom-3 left-3 right-3 bg-white p-2 rounded-lg h-26 overflow-hidden">
                            <div className="flex flex-col h-full">
                              <h3 className="text-sm font-bold text-gray-800 truncate">
                                {achievement.name}{" "}
                                <span className="text-red-500 text-sm font-normal ml-1">
                                  {achievement.batch}
                                </span>
                              </h3>
                              <div className="text-yellow-500 text-sm my-1">
                                {achievement.achievement_type && (
                                  <span className="truncate block">
                                    {achievement.achievement_type}
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex-1 overflow-hidden">
                                <p className="text-gray-500 text-sm line-clamp-3">
                                  {achievement.achievement_description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              {/* Gradient overlays for seamless effect */}
              <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-amber-50 to-transparent z-10"></div>
              <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-amber-50 to-transparent z-10"></div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search Student"
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-white rounded-full border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() =>
                    setSelectedFilter(filter === selectedFilter ? "" : filter)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap hover:shadow-sm ${
                    selectedFilter === filter
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-white border border-gray-300 hover:bg-amber-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Mobile Filters Dropdown */}
            <div
              className={`sm:hidden overflow-hidden transition-all duration-300 ${
                isFilterMenuOpen ? "max-h-48" : "max-h-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-2 py-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(
                        filter === selectedFilter ? "" : filter
                      );
                      setIsFilterMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      selectedFilter === filter
                        ? "bg-amber-500 text-white"
                        : "bg-white border border-gray-300 hover:bg-amber-50"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredAchievements.length === 0 ? (
          <p className="text-center text-gray-600">No results found</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentAchievements.map((achievement) => (
                <motion.div
                  key={achievement._id}
                  className="group relative bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Photo with animation */}
                  <motion.div
                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-full mb-4 overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    {achievement.photo ? (
                      <img
                        src={`data:image/jpeg;base64,${achievement.photo}`}
                        alt={achievement.name}
                        className="w-full h-full object-fill"
                      />
                    ) : (
                      <div className="w-full h-full bg-yellow-500 flex items-center justify-center text-2xl font-bold text-white">
                        {getInitials(achievement.name)}
                      </div>
                    )}
                    <motion.div
                      className="absolute inset-0 bg-amber-500 mix-blend-overlay opacity-0"
                      whileHover={{ opacity: 0.3 }}
                    />
                  </motion.div>

                  {/* Name and Role */}
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                    {achievement.name}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mb-2">
                    {achievement.achievement_type}
                    <br />
                    <span className="text-amber-400 text-xs md:text-sm font-medium">
                      {achievement.batch}
                    </span>
                  </p>

                  {/* Email */}
                  <p className="text-xs md:text-sm text-gray-600 mb-4">
                    {achievement.email}
                  </p>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-gray-700 text-center line-clamp-3">
                    {achievement.achievement_description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAchievements.length}
              itemsPerPage={itemsPerPage}
              onPageChange={paginate}
            />
          </>
        )}
        {/* Footer */}
        <Footer />
      </div>
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        /* Marquee container styles */
        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .marquee-content {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
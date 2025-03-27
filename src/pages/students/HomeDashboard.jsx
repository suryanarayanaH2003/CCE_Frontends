import { useContext, useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import Cookies from "js-cookie";
import { LoaderContext } from "../../components/Common/Loader";
import gridImg from "../../assets/images/Grid Lines.png";
import HomeCard from "../../components/Students/HomeCard";
import CarouselAchievments from "../../components/Students/CarouselAchievments";
import Image from "../../assets/images/AboutCCE1.png";
import Image1 from "../../assets/images/AboutCCE2.png";
import { Link } from 'react-router-dom';

import { FiBookmark, FiMapPin, FiEye, FiClock } from "react-icons/fi";


// icon imports
import codeSandBoxIcon from "../../assets/icons/codesandbox.png";
import pullIcon from "../../assets/icons/git-pull-request.png";
import gridIcon from "../../assets/icons/grid-icon.png";
import mailIcon from "../../assets/icons/mail.png";
import sendIcon from "../../assets/icons/send.png";
import fileIcon from "../../assets/icons/file.png";

import { toast, ToastContainer } from "react-toastify";

const themeButton =
  "px-7 py-[8px]  rounded w-fit text-md bg-[#FFCC00] cursor-pointer";

import { IoIosArrowForward } from "react-icons/io";
import { IoMdClose, IoMdAdd } from "react-icons/io";

import { FiMail, FiPhone } from "react-icons/fi";

//image imports
import mentor1 from "../../assets/images/mentors (1).jpeg";
import mentor2 from "../../assets/images/mentors (2).jpeg";
import mentor3 from "../../assets/images/user.png";
import { jwtDecode } from "jwt-decode";
const ContactSection = ({ formData, setFormData, handleSubmit }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:space-x-12 space-y-8 md:space-y-0 justify-stretch py-8 pt-12 md:pt-22 relative">
      <img
        src={gridImg || "/placeholder.svg"}
        className="absolute w-full h-full -z-1 object-cover"
        alt=""
      />

      <div className="w-full flex flex-col md:flex-row gap-6 md:gap-0">
        {/* Left Section */}
        <div className="w-full md:w-1/2 space-y-4 px-4 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            Get in Touch with Us Today!
          </h2>
          <p className="text-gray-600">
            Your Questions Matter – We’re Here to Support You Every Step of the
            Way
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-8 md:space-x-18 space-y-6 sm:space-y-0 py-6 md:py-12 w-full">
            <div className="flex flex-col items-stretch space-y-2 sm:space-y-0 sm:space-x-3 pb-2 flex-1">
              <div className="border-b pb-2.5 mb-2.5">
                <FiMail className="w-8 h-8 p-1.5 border rounded-lg border-gray-500 mb-1" />
                <p className="text-xl font-bold mt-1">Message Us</p>
              </div>

              <p className="text-gray-500">support@gmail.com</p>
            </div>
            <div className="flex flex-col items-stretch space-y-2 sm:space-y-0 sm:space-x-3 pb-2 flex-1">
              <div className="border-b pb-2.5 mb-2.5">
                <FiPhone className="w-8 h-8 p-1.5 border rounded-lg border-gray-500 mb-1" />
                <p className="text-xl font-bold mt-1">Call Us</p>
              </div>

              <p className="text-gray-500">+91 98765 54321</p>
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:flex-1 px-4 md:px-0">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full mt-0 md:mt-0">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                disabled
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 opacity-75 rounded bg-yellow-100 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                disabled
                placeholder="Your email"
                value={formData.student_email}
                onChange={handleChange}
                className="w-full p-3 opacity-75 rounded bg-yellow-100 focus:outline-none"
              />
              <textarea
                name="message"
                placeholder="How can we help..."
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded bg-yellow-100 focus:outline-none h-32 resize-none"
                maxLength="300"
              ></textarea>
              <button
                type="submit"
                className="w-full cursor-pointer bg-yellow-400 text-black font-semibold py-3 rounded hover:bg-yellow-500 transition"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "Are the study materials free to access?",
      answer:
        "Yes, all study materials provided on our platform are free for students. You can download PDFs, presentations, and other resources to help with your exam and job preparation.",
      linkText: "Explore the Study Materials",
      linkTo: "/study-material"
    },
    {
      question: "Where can I find job opportunities?",
      answer: "You can explore a wide range of job opportunities on our platform. Filter by industry, role, and location to find the perfect fit for you.",
      linkText: "Explore the Jobs",
      linkTo: "/jobs"
    },
    {
      question: "How can I find internship opportunities?",
      answer: "Our platform provides a dedicated section for internships. Browse through various opportunities and apply to gain valuable experience in your field.",
      linkText: "Explore the Internships",
      linkTo: "/internships"
    },
    {
      question: "How will I know about upcoming exams?",
      answer: "You will receive timely notifications about new exam postings. Stay updated by enabling notifications in your account settings.",
      linkText: "Explore the Exams",
      linkTo: "/exams"
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center items-center py-12 md:py-24 w-[95%] md:w-[90%]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Left Side */}
        <div className="flex flex-col space-y-4 justify-center">
          <h2 className="text-3xl md:text-5xl">FAQs</h2>
          <p className="text-gray-500">
            Your Questions, Answered – Everything You Need to Know
          </p>
        </div>

        {/* Right Side - FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 bg-white relative"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <p className="font-medium text-sm md:text-base">
                  {faq.question}
                </p>
                <button className="p-2 rounded-full bg-yellow-300">
                  {openIndex === index ? (
                    <IoIosArrowForward className="transform rotate-90" />
                  ) : (
                    <IoIosArrowForward />
                  )}
                </button>
              </div>
              {openIndex === index && faq.answer && (
                <div className="mt-2 text-gray-600">
                  <p>{faq.answer}</p>
                  {faq.linkText && (
                    <Link to={faq.linkTo} className="flex items-center mt-2 p-3 bg-gray-100 rounded-md cursor-pointer">
                      <p>{faq.linkText}</p>
                      <IoIosArrowForward className="ml-auto" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  // Define static job data directly within the Header component
  const staticJobs = [
    {
      _id: "1",
      title: "Software Engineer",
      company_name: "Tech Corp",
      location: "Bangalore",
      job_description: "Develop and maintain software applications.",
      updated_at: "Just now",
      views: 150,
      status: "Active",
      type: "job"
    },
    {
      _id: "2",
      title: "Data Scientist",
      company_name: "Data Solutions",
      location: "Mumbai",
      job_description: "Analyze data and build predictive models.",
      updated_at: "2025-09-25T09:30:00Z",
      views: 200,
      status: "Active",
      type: "job"
    },
    {
      _id: "3",
      title: "Product Manager",
      company_name: "Innovate Inc",
      location: "Delhi",
      job_description: "Manage product lifecycle and roadmap.",
      updated_at: "old",
      views: 180,
      status: "Active",
      type: "job"
    }
  ];

  return (
    <header className="w-full relative" id="hero">
      <img
        src={gridImg || "/placeholder.svg"}
        alt=""
        className="absolute h-full w-full -z-1 object-cover"
      />

      <div className="h-20"></div>

      <div className="w-full">
        <StudentPageNavbar transparent={true} />
      </div>

      {staticJobs.length > 0 && (
        <div className="w-full h-full absolute hidden md:flex">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center px-20 pt-10">
              <div className="w-70 rotate-[-20deg] hover:rotate-[0deg] hover:scale-[1.2] cursor-pointer">
                <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-col justify-between p-2 text-[10px]">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                          {staticJobs[0].title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600 text-[13px]">
                          <span className="flex items-center">
                            <i className="bi bi-building mr-1 opacity-75 text-[12px]"></i>
                            {staticJobs[0].company_name}
                          </span>
                          <span className="flex items-center">
                            <FiMapPin className="mr-1 opacity-75 text-[12px]" />
                            {staticJobs[0].location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2 leading-snug text-[13px]">
                      {staticJobs[0].job_description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500 text-[13px]">
                      <div className="flex items-center">
                        <FiClock className="mr-1 opacity-75 text-[12px]" />
                        {timeAgo(staticJobs[0].updated_at)}
                      </div>
                      <div className="flex items-center">
                        <FiEye className="mr-1 opacity-75 text-[12px]" />
                        {formatViewCount(staticJobs[0].views)} views
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-2 border-t border-gray-100">
                    <span className="inline-flex items-center rounded-full font-medium text-[10px] py-0.5 px-1 text-green-800">
                      <span className="mr-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      ON GOING
                    </span>
                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                      <button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black rounded-sm text-[11px] py-1 px-2">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-end px-30 pb-30">
              <div className="w-70 scale-[0.5] rotate-[-50deg] relative hover:rotate-[0deg] hover:scale-[1.1]">
                <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-col justify-between p-2 text-[10px]">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                          {staticJobs[1].title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600 text-[13px]">
                          <span className="flex items-center">
                            <i className="bi bi-building mr-1 opacity-75 text-[12px]"></i>
                            {staticJobs[1].company_name}
                          </span>
                          <span className="flex items-center">
                            <FiMapPin className="mr-1 opacity-75 text-[12px]" />
                            {staticJobs[1].location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2 leading-snug text-[13px]">
                      {staticJobs[1].job_description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500 text-[13px]">
                      <div className="flex items-center">
                        <FiClock className="mr-1 opacity-75 text-[12px]" />
                        {timeAgo(staticJobs[1].updated_at)}
                      </div>
                      <div className="flex items-center">
                        <FiEye className="mr-1 opacity-75 text-[12px]" />
                        {formatViewCount(staticJobs[1].views)} views
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-2 border-t border-gray-100">
                    <span className="inline-flex items-center rounded-full font-medium text-[10px] py-0.5 px-1 text-green-800">
                      <span className="mr-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      ON GOING
                    </span>
                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                      <button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black rounded-sm text-[11px] py-1 px-2">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end -mt-30 px-30">
            <div className="w-70 rotate-[20deg] scale-[0.8] relative hover:rotate-[0deg] hover:scale-[1.2] cursor-pointer">
              <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-col justify-between p-2 text-[10px]">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                        {staticJobs[2].title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600 text-[13px]">
                        <span className="flex items-center">
                          <i className="bi bi-building mr-1 opacity-75 text-[12px]"></i>
                          {staticJobs[2].company_name}
                        </span>
                        <span className="flex items-center">
                          <FiMapPin className="mr-1 opacity-75 text-[12px]" />
                          {staticJobs[2].location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2 line-clamp-2 leading-snug text-[13px]">
                    {staticJobs[2].job_description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500 text-[13px]">
                    <div className="flex items-center">
                      <FiClock className="mr-1 opacity-75 text-[12px]" />
                      {timeAgo(staticJobs[2].updated_at)}
                    </div>
                    <div className="flex items-center">
                      <FiEye className="mr-1 opacity-75 text-[12px]" />
                      {formatViewCount(staticJobs[2].views)} views
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-2 border-t border-gray-100">
                  <span className="inline-flex items-center rounded-full font-medium text-[10px] py-0.5 px-1 text-green-800">
                    <span className="mr-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    ON GOING
                  </span>
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black rounded-sm text-[11px] py-1 px-2">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col items-center text-center py-12 md:py-20 lg:py-34 space-y-3 md:space-y-5 z-20">
        <p className="text-3xl md:text-5xl lg:text-7xl font-semibold">
          {" "}
          One Step Closer To <br /> Your{" "}
          <span className="text-[#FFCC00]"> Dream Job </span>{" "}
        </p>
        <p className="text-sm md:text-base">
          {" "}
          let us help you find a job that suits you the best!{" "}
        </p>
        <button
          className={themeButton + " z-20"}
          onClick={() => (window.location.href = "jobs")}
        >
          {" "}
          Explore{" "}
        </button>
      </div>

      <div className="relative w-full">
        <p className="w-full bg-[#FFCC00] p-2 md:p-4 px-0 rotate-[2deg] text-justify shadow-lg leading-snug custom-justify text-sm md:text-lg lg:text-2xl">
          Build an entrepreneurial mindset through our Design Thinking Framework
          * Redesigning common mind and Business Towards Excellence
        </p>

        <p className="absolute -z-1 top-0 w-full bg-[#e4b600] p-6 py-9 rotate-[-2deg]">
          {" "}
        </p>
      </div>
    </header>
  );
};

// Helper functions
function timeAgo(dateString) {
  const givenDate = new Date(dateString);
  const now = new Date();
  const secondsDiff = Math.floor((now - givenDate) / 1000);

  const years = Math.floor(secondsDiff / 31536000);
  if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;

  const months = Math.floor(secondsDiff / 2592000);
  if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;

  const days = Math.floor(secondsDiff / 86400);
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;

  const hours = Math.floor(secondsDiff / 3600);
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const minutes = Math.floor(secondsDiff / 60);
  if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return "Just now";
}

function formatViewCount(count) {
  if (count === undefined || count === null) {
    return "0";
  }

  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  }

  return count.toString();
}



const Insights = () => {
  return (
    <section className="w-[90%] md:w-[85%] self-center flex flex-col items-center space-y-10 md:space-y-20 px-4 md:px-0 ]">
      <div className="relative w-full h-full shadow-2xl rounded-lg shadow-white">
        <video
          src="/video.MOV"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white to-transparent rounded-b-lg"></div>
      </div>
      <div className="bg-[#070E20] w-screen min-h-screen px-4 py-8 md:px-20">
        <div className="flex flex-col items-center space-y-2 text-center md:mt-10 ">
          <p className="text-2xl md:text-4xl font-semibold text-white">
            {" "}
            Your Ultimate Career Toolkit{" "}
          </p>
          <p className="text-gray-500 text-sm md:text-base text-gray-400 mb-5">
            {" "}
            Essential Tools to Elevate Your Job Search & Career Growth.{" "}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[
            {
              icon: fileIcon,
              title: "Verified Study Materials",
              content:
                "Prepare for competitive exams and job applications with high-quality resources.",
            },
            {
              icon: mailIcon,
              title: "Job and Internship Listings",
              content:
                "Find categorized opportunities based on your skills, industry, and career goals.",
            },
            {
              icon: pullIcon,
              title: "Guidance and Student Support",
              content:
                "Get personalized advice, career mentorship, and assistance through our support team.",
            },
            {
              icon: sendIcon,
              title: "Achievements",
              content:
                "Highlight your career milestones, job placements, and exam successes to inspire others.",
            },
            {
              icon: gridIcon,
              title: "Job and Internship Alerts",
              content:
                " Get instant notifications for new job openings and internship opportunities.",
            },
            {
              icon: codeSandBoxIcon,
              title: "Seamless Application Process",
              content:
                "Apply to jobs effortlessly with a user-friendly and structured platform.",
            },
          ].map((item, key) => {
            const shuffleArray = (array) =>
              array.sort(() => Math.random() - 0.5);

            const baseColors = [
              "#f8c974",
              "#fcf5ec",
              "#e09343",
              "#9f501e",
              "#f8c974",
            ];

            var shuffledArray = shuffleArray([...baseColors]);
            shuffledArray = [...shuffledArray, shuffledArray[0]];

            const randomizedGradient = `conic-gradient(${shuffledArray.join(
              ", "
            )})`;

            return (
              <div
                key={key}
                className="custom-border relative p-4 py-6 flex flex-col space-y-8 justify-between h-full text-white rounded-2xl"
                style={{
                  "--custom-gradient": randomizedGradient,
                  background: "transparent",
                  position: "relative",
                  boxShadow: "0 0 0 2px rgba(248, 201, 116, 0.2)",
                }}
              >
                {/* Gradient border with glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl -z-10"
                  style={{
                    background:
                      "linear-gradient(to bottom right, #fcf5ec, #f8c974, #e09343)",
                    padding: "1px",
                    content: "''",
                    filter: "blur(0.5px)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                  }}
                />

                <div>
                  <img
                    src={item.icon || "/placeholder.svg"}
                    className="w-6 mb-1"
                    alt=""
                  />
                  <p className="text-xl font-semibold"> {item.title} </p>
                </div>
                <p className="text-sm md:text-base"> {item.content} </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Thatabout = ({ achieversImages, achievements }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <section className="flex flex-col lg:flex-row w-[90%] mx-auto py-10 md:py-20 lg:py-30 items-center gap-8 px-4 md:px-0">
      {/* Text Section */}
      <div className="space-y-3 w-full lg:flex-1 text-center lg:text-left">
        <p className="text-3xl md:text-4xl font-semibold">
          Celebrating Student
        </p>
        <p className="text-3xl md:text-4xl font-semibold">Success &</p>
        <p className="text-3xl md:text-4xl font-semibold">Achievements!</p>
        <p className="text-gray-600 text-sm md:text-base">
          Inspiring Journeys, Remarkable Milestones
        </p>
        <button
          className={themeButton}
          onClick={
            !isLoggedIn
              ? () => (window.location.href = "/")
              : () => (window.location.href = "/achievements")
          }
        >
          {!isLoggedIn ? "Log In" : "Visit Achievements"}
        </button>
      </div>
  
      {/* Image Section */}
      <div className="w-full lg:w-2/3 flex justify-center lg:justify-end">
        <div className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[600px] aspect-square border-dashed border border-[#ffcc00] rounded-full flex items-center justify-center relative">
          {/* Animation containers for outer circle */}
          <div className="absolute inset-0 rounded-full" style={{ animation: 'spin 45s linear infinite' }}>
            {/* Image 1 - Fixed positioning to be like others */}
            <div className="absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2" style={{ animation: 'counterSpin 45s linear infinite' }}>
              <img
                src={
                  !achieversImages[0]
                    ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                    : `data:image/jpeg;base64,${achieversImages[0]}`
                }
                alt="Achiever 1"
                className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square transition-transform duration-300 hover:scale-150 hover:z-50"
                onMouseEnter={() => setHoveredIndex(0)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {hoveredIndex === 0 && achievements && achievements[0] && (
                <div className="absolute bg-white p-2 rounded shadow-md z-50 w-40 text-xs -top-16 left-1/2 transform -translate-x-1/2">
                  <p className="font-bold">{achievements[0].name}</p>
                  <p>{achievements[0].achievement_type}</p>
                </div>
              )}
            </div>
  
            {/* Image 2 */}
            <div className="absolute bottom-6 sm:bottom-14 md:bottom-18 right-6 sm:right-8 md:right-10" style={{ animation: 'counterSpin 45s linear infinite' }}>
              <img
                src={
                  !achieversImages[1]
                    ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                    : `data:image/jpeg;base64,${achieversImages[1]}`
                }
                alt="Achiever 2"
                className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square transition-transform duration-300 hover:scale-150 hover:z-50"
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {hoveredIndex === 1 && achievements && achievements[1] && (
                <div className="absolute bg-white p-2 rounded shadow-md z-50 w-40 text-xs right-0 -top-16">
                  <p className="font-bold">{achievements[1].name}</p>
                  <p>{achievements[1].achievement_type}</p>
                </div>
              )}
            </div>
  
            {/* Image 3 */}
            <div className="absolute bottom-6 sm:bottom-14 md:bottom-18 left-6 sm:left-8 md:left-12" style={{ animation: 'counterSpin 45s linear infinite' }}>
              <img
                src={
                  !achieversImages[2]
                    ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                    : `data:image/jpeg;base64,${achieversImages[2]}`
                }
                alt="Achiever 3"
                className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square transition-transform duration-300 hover:scale-150 hover:z-50"
                onMouseEnter={() => setHoveredIndex(2)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {hoveredIndex === 2 && achievements && achievements[2] && (
                <div className="absolute bg-white p-2 rounded shadow-md z-50 w-40 text-xs left-0 -top-16">
                  <p className="font-bold">{achievements[2].name}</p>
                  <p>{achievements[2].achievement_type}</p>
                </div>
              )}
            </div>
  
            {/* Image 4 */}
            <div className="absolute top-14 sm:top-20 md:top-30 left-0" style={{ animation: 'counterSpin 45s linear infinite' }}>
              <img
                src={
                  !achieversImages[3]
                    ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                    : `data:image/jpeg;base64,${achieversImages[3]}`
                }
                alt="Achiever 4"
                className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square transition-transform duration-300 hover:scale-150 hover:z-50"
                onMouseEnter={() => setHoveredIndex(3)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {hoveredIndex === 3 && achievements && achievements[3] && (
                <div className="absolute bg-white p-2 rounded shadow-md z-50 w-40 text-xs right-0 -top-16">
                  <p className="font-bold">{achievements[3].name}</p>
                  <p>{achievements[3].achievement_type}</p>
                </div>
              )}
            </div>
  
            {/* Image 5 */}
            <div className="absolute top-14 sm:top-20 md:top-30 right-0" style={{ animation: 'counterSpin 45s linear infinite' }}>
              <img
                src={
                  !achieversImages[4]
                    ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                    : `data:image/jpeg;base64,${achieversImages[4]}`
                }
                alt="Achiever 5"
                className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square transition-transform duration-300 hover:scale-150 hover:z-50"
                onMouseEnter={() => setHoveredIndex(4)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {hoveredIndex === 4 && achievements && achievements[4] && (
                <div className="absolute bg-white p-2 rounded shadow-md z-50 w-40 text-xs left-0 -top-16">
                  <p className="font-bold">{achievements[4].name}</p>
                  <p>{achievements[4].achievement_type}</p>
                </div>
              )}
            </div>
          </div>
  
          {/* Inner Circle with Animation */}
          <div className="h-[120px] sm:h-[150px] md:h-[300px] aspect-square border-dashed border border-[#ffcc00] rounded-full flex items-center justify-center relative">
            {/* Inner Circle Animation */}
            <div className="absolute inset-0 rounded-full" style={{ animation: 'spinReverse 45s linear infinite' }}>
              {/* Image 6 - Fixed positioning to be like others */}
              <div className="absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2" style={{ animation: 'spin 45s linear infinite' }}>
                <img
                  src={
                    !achieversImages[5]
                      ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                      : `data:image/jpeg;base64,${achieversImages[5]}`
                  }
                  alt="Achiever 6"
                  className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square transition-transform duration-300 hover:scale-150 hover:z-50"
                  onMouseEnter={() => setHoveredIndex(5)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {hoveredIndex === 5 && achievements && achievements[5] && (
                  <div className="absolute bg-white p-2 rounded shadow-md z-50 w-40 text-xs left-1/2 transform -translate-x-1/2 -top-16">
                    <p className="font-bold">{achievements[5].name}</p>
                    <p>{achievements[5].achievement_type}</p>
                  </div>
                )}
              </div>
  
              {/* Image 7 */}
              <div className="absolute bottom-3 sm:bottom-4 md:bottom-7 left-0" style={{ animation: 'spin 45s linear infinite' }}>
                <img
                  src={
                    !achieversImages[6]
                      ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                      : `data:image/jpeg;base64,${achieversImages[6]}`
                  }
                  alt="Achiever 7"
                  className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square transition-transform duration-300 hover:scale-150 hover:z-50"
                  onMouseEnter={() => setHoveredIndex(6)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {hoveredIndex === 6 && achievements && achievements[6] && (
                  <div className="absolute bg-white p-2 rounded shadow-md z-50 w-40 text-xs right-0 -top-16">
                    <p className="font-bold">{achievements[6].name}</p>
                    <p>{achievements[6].achievement_type}</p>
                  </div>
                )}
              </div>
  
              {/* Image 8 */}
              <div className="absolute bottom-3 sm:bottom-4 md:bottom-7 right-0" style={{ animation: 'spin 45s linear infinite' }}>
                <img
                  src={
                    !achieversImages[7]
                      ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                      : `data:image/jpeg;base64,${achieversImages[7]}`
                  }
                  alt="Achiever 8"
                  className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square transition-transform duration-300 hover:scale-150 hover:z-50"
                  onMouseEnter={() => setHoveredIndex(7)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {hoveredIndex === 7 && achievements && achievements[7] && (
                  <div className="absolute bg-white p-2 rounded shadow-md z-50 w-40 text-xs left-0 -top-16">
                    <p className="font-bold">{achievements[7].name}</p>
                    <p>{achievements[7].achievement_type}</p>
                  </div>
                )}
              </div>
            </div>
  
            {/* Center Image (Not Rotating) - Fixed hover effect */}
            <div className="relative">
              <img
                src={
                  !achieversImages[8]
                    ? "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg"
                    : `data:image/jpeg;base64,${achieversImages[8]}`
                }
                alt="Achiever 9"
                className="w-8 sm:w-10 md:w-16 rounded-full object-cover aspect-square transition-transform duration-300 hover:scale-150 hover:z-50"
                onMouseEnter={() => setHoveredIndex(8)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {hoveredIndex === 8 && achievements && achievements[8] && (
                <div className="absolute bg-white p-2 rounded shadow-md z-50 w-40 text-xs left-1/2 transform -translate-x-1/2 -top-16">
                  <p className="font-bold">{achievements[8].name}</p>
                  <p>{achievements[8].achievement_type}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spinReverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        
        @keyframes counterSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </section>
  );
};
const AboutCCE = () => {
  return (
    <section className="flex flex-col w-[90%] space-y-10 md:space-y-20 items-center px-4 md:px-0">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Hero Section with Background Image */}
        <div className="relative rounded-lg overflow-hidden mb-6">
          <div className="h-64 md:h-80">
            <img
              src={Image || "/placeholder.svg"}
              alt="Students in classroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
                About CCE
              </h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - About Us */}
          <div className="md:col-span-6">
            <div className="p-6 rounded-lg border border-gray-200 shadow-sm h-full">
              <h2 className="text-xl md:text-2xl font-bold mb-4">About Us</h2>
              <div className="text-sm space-y-4 text-justify">
                <p>
                  At SNS Institutions, we constantly endeavor to identify the
                  potential opportunities for our students to elevate their
                  personality and professional competence, which in turn will
                  enhance their socio-economic status.
                </p>
                <p>
                  To strengthen our endeavor further, a unique center by name
                  "Center for Competitive Exams" has been created, which will
                  function under the command and control of the Dr Nalin Vimal
                  Kumar, Technical Director, SNS Institutions, with an aim to
                  guide and assist students to get placed in Indian Armed
                  Forces, Paramilitary Forces, Union & State Public Service
                  Commission (UPSC & TNPSC), Defence Research & Development
                  Organisation (DRDO) Labs, Council of Scientific & Industrial
                  Research (CSIR) Labs, Indian Space Research Organisation
                  (ISRO), Department of Science & Technology (DST), Indian
                  Engineering Services, Defence Public Sector Undertakings
                  (DPSUs), Central Public Sector Undertakings (CPSUs) and State
                  Public Sector Undertakings (SPSUs), in addition to various
                  Micro Small & Medium Enterprise (MSME) clusters and Private
                  companies associated with the aforesaid organisations.
                </p>
                <p>
                  In addition, the center will also endeavor to identify
                  opportunities for pursuing Internship & Research in renowned
                  Institutions and Organisations. To steer the activities in the
                  right direction, Commander (Dr.) D K Karthik (Retd.) has been
                  hired and appointed as Professor & Head-Center for Competitive
                  Exams, SNS Institutions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="bg-white rounded-l-lg md:col-span-6 space-y-6 md:-mt-16 z-10">
            <div className="p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">
                About the Head of CCE
              </h3>
              <p className="text-sm mb-4 text-justify">
                Commander (Dr.) D K Karthik (Retd.) has completed his BE from
                National Institute of Technology (NIT), Rourkela, M.Tech from
                Indian Institute of Technology (IIT), Bombay and Ph.D from
                National Institute of Technology (NIT), Tiruchirappalli. Prior
                joining SNS Institutions in Nov 2024, he has served in M/ s HCL
                Infosystems Ltd, Bangalore between 2001-02 and the Indian Navy
                between 2002-24.
              </p>
              <p className="text-sm text-justify">
                During his illustrious career of over 22 years in the Indian
                Navy, he has served onboard warships, visited 06 Nations on
                diplomatic assignments, held key portfolios related to
                Operations, Maintenance & Training in Command Headquarters &
                Naval Ship Repair Yards and extensively interacted with various
                Central & State Government Organisations. In addition to his
                primary portfolios, he was a member of Naval Recruitment team
                for over 04 years and Project Officer overseeing the Indigenous
                development of Foreign origin equipment.
              </p>
            </div>
            {/* Bottom Image */}
            <div className="rounded-lg overflow-hidden h-48 md:h-64">
              <img
                src={Image1 || "/placeholder.svg"}
                alt="CCE activities"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#070E20] w-screen min-h-screen px-4 py-8 md:px-8">
        <div className="flex flex-col items-center text-center space-y-3 md:space-y-5 mt-4 md:mt-8">
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-medium">
            Meet Our Expert Team
          </p>
          <p className="text-sm md:text-base text-gray-400 mb-5">
            Guiding You Towards Success With Knowledge & Experience
            <br className="hidden md:block" />
          </p>
        </div>

        <div
          className="flex flex-col md:flex-row md:space-x-3 lg:space-x-6 xl:space-x-14 space-y-8 md:space-y-0 
                  mb-8 md:mb-12 lg:mb-18 w-full max-w-5xl mx-auto mt-8 justify-center items-center md:items-stretch"
        >
          {[
            {
              name: "Dr. Karthik",
              post: "BE, M.Tech, Ph.D",
              title: "Head of CCE",
              photo: "https://smitg.ukzn.ac.za/wp-content/uploads/2022/07/default-profie-image-m.jpg",
            },
            {
              name: "Mohana Priya",
              //post: "M.Tech, Ph.D (Maths)",
              title: "CCE Admin Executive",
              photo: mentor1,
            },
            {
              name: "Sindhuja S",
              post: "M.Tech, Ph.D (Maths)",
              title: "Asstitant Professor (Maths)",
              photo: mentor2,
            },
          ].map((person, key) => {
            const shuffleArray = (array) =>
              array.sort(() => Math.random() - 0.5);

            // Define the base colors
            const baseColors = [
              "#f8c974",
              "#fcf5ec",
              "#e09343",
              "#9f501e",
              "#f8c974",
            ];

            var shuffledArray = shuffleArray([...baseColors]);
            shuffledArray = [...shuffledArray, shuffledArray[0]];

            // Shuffle colors randomly for each div
            const randomizedGradient = `conic-gradient(${shuffledArray.join(
              ", "
            )})`;

            return (
              <div
                key={key}
                className="relative w-full md:w-auto md:flex-1 aspect-[3/4] sm:aspect-[2/3] max-w-[280px] sm:max-w-[320px]  rounded-lg overflow-hidden"
                style={{
                  position: "relative",
                  padding: "3px",
                  background: randomizedGradient,
                }}
              >
                <div className="w-full h-full bg-[#7DA1A1] rounded-md overflow-hidden relative">
                  <img
                    src={person.photo || "/placeholder.svg"}
                    alt=""
                    className="object-cover h-full w-full absolute rounded-md"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="flex flex-col items-start w-full bg-[#ffffffde] p-2 sm:p-3 rounded-lg">
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col  gap-1">
                        <p className="text-lg sm:text-xl md:text-2xl leading-tight font-medium">
                          {person.name}
                        </p>
                        <p className="text-xs text-rose-400">{person.post}</p>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-0.5">
                        {person.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default function HomeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [unconfirmedJob, setUnconfirmedJob] = useState(null);
  const [unconfirmedApplications, setUnconfirmedApplications] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [jobsRes, achievementsRes, internshipsRes, examsRes] = await Promise.all([
          axios.get( `${API_BASE_URL}/api/published-jobs/`),
          axios.get( `${API_BASE_URL}/api/published-achievement/`),
          axios.get( `${API_BASE_URL}/api/published-internship/`),
          axios.get( `${API_BASE_URL}/api/published-exams/`), // Ensure this endpoint is correct
        ]);

        setJobs(jobsRes.data.jobs.filter(job => job.status === "Active"));
        setAchievements(achievementsRes.data.achievements);
        setInternships(internshipsRes.data.internships.filter(internship => internship.status === "Active"));
        setExams(examsRes.data.exams.filter(exam => exam.status === "Active"));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setIsLoading]);


  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(
          `${API_BASE_URL}/api/applied-jobs/${userId}/`
        );
        const appliedJobs = response.data.jobs;

        const unconfirmed = appliedJobs.find((job) => job.confirmed === null);
        if (unconfirmed) {
          // Fetch job details using the job ID
          const jobResponse = await axios.get(
            `${API_BASE_URL}/api/job/${unconfirmed.job_id}/`
          );
          const jobDetails = jobResponse.data.job;
          setUnconfirmedJob({ ...unconfirmed, job_data: jobDetails.job_data });
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    checkApplicationStatus();
  }, []);

  const handleConfirm = async (type, applicationId) => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;

      let endpoint;
      switch (type) {
        case "job":
          endpoint = "confirm-job/";
          break;
        case "internship":
          endpoint = "confirm-internship/";
          break;
        case "exam":
          endpoint = "confirm-exam/";
          break;
        default:
          throw new Error("Unknown application type");
      }

      await axios.post(`${API_BASE_URL}/api/${endpoint}`, {
        studentId: userId,
        Id: applicationId,
        confirmed: true,
      });
      setUnconfirmedApplications((prevApplications) => prevApplications.filter((application) => application._id !== applicationId));
      if (unconfirmedApplications.length ==1){
        setShowPopup(false)
      }
    } catch (error) {
      console.error("Error confirming application:", error);
      alert("Unable to track application. Please try again later.");
    }
  };

  useEffect(() => {
  }, [unconfirmedApplications]);

  const handleCancel = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post(`${API_BASE_URL}/api/confirm-job/`, {
        studentId: userId,
        jobId: unconfirmedJob.job_id,
        confirmed: false,
      });
      setShowPopup(false);
    } catch (error) {
      console.error("Error marking job application as not confirmed:", error);
      alert(
        "Unable to mark application as not confirmed. Please try again later."
      );
    }
  };

  const mentors = [
    {
      photo:
        "https://media.istockphoto.com/id/1300512215/photo/headshot-portrait-of-smiling-ethnic-businessman-in-office.jpg?s=612x612&w=0&k=20&c=QjebAlXBgee05B3rcLDAtOaMtmdLjtZ5Yg9IJoiy-VY=",
      name: "Joe",
    },
    {
      photo:
        "https://t3.ftcdn.net/jpg/06/39/64/14/360_F_639641415_lLjzVDVwL0RwdNrkURYFboc4N21YIXJR.jpg",
      name: "Samaratian",
    },
    {
      photo: "https://cdn2.f-cdn.com/files/download/38547697/ddc116.jpg",
      name: "Jane",
    },
    {
      photo:
        "https://media.istockphoto.com/id/1317804578/photo/one-businesswoman-headshot-smiling-at-the-camera.jpg?s=612x612&w=0&k=20&c=EqR2Lffp4tkIYzpqYh8aYIPRr-gmZliRHRxcQC5yylY=",
      name: "Emma",
    },
    {
      photo:
        "https://thumbs.dreamstime.com/b/profile-picture-caucasian-male-employee-posing-office-happy-young-worker-look-camera-workplace-headshot-portrait-smiling-190186649.jpg",
      name: "Shaun",
    },
    {
      photo:
        "https://th.bing.com/th/id/R.bc205eac509090ba026433b1565bc18a?rik=1BblnGHP1wqVYA&riu=http%3a%2f%2fwww.perfocal.com%2fblog%2fcontent%2fimages%2f2021%2f01%2fPerfocal_17-11-2019_TYWFAQ_100_standard-3.jpgfwww.perfocal.com%2fblog%2fcontent%2fimages%2f2021%2f01%2fPerfocal_17-11-2019_TYWFAQ_100_standard-3.jpg&ehk=MXaB6gPhPiykBuERz%2bfG0C9O7kxtvL6qKybZiRVExMI%3d&risl=&pid=ImgRaw&r=0",
      name: "Ghale",
    },
    {
      photo:
        "https://th.bing.com/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?rs=1&pid=ImgDetMain",
      name: "Elise",
    },
    {
      photo:
        "https://th.bing.com/th/id/OIP.bwuFduLmNb4boaf_mWiVFgHaFG?rs=1&pid=ImgDetMain",
      name: "Pitt",
    },
    {
      photo:
        "https://m.media-amazon.com/images/M/MV5BNGJmMWEzOGQtMWZkNS00MGNiLTk5NGEtYzg1YzAyZTgzZTZmXkEyXkFqcGdeQXVyMTE1MTYxNDAw._V1_FMjpg_UX1000_.jpg",
      name: "Reeves",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    student_email: "",
    message: "",
  });

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const studentId = decodedToken.student_user;
        const storedEmail = localStorage.getItem("student.email");
        const storedName = Cookies.get("username");

        // Only update state if the values are different
        if (storedName && storedEmail && studentId) {
          setFormData((prevData) => ({
            ...prevData,
            name: storedName,
            student_email: storedEmail,
            student_id: studentId,
          }));
        }
      } catch (error) {
        console.error("Invalid token format.", error);
      }
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/contact-us/`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsLoading(false);
      toast.success(response.data.message || "Message sent successfully!");

      setTimeout(() => {
        window.location.reload(); // Refresh page after success
      }, 1500); // Wait 1.5 seconds before refreshing
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data.error || "Something went wrong!");
    } finally {
      setIsLoading(false); // Reset button text
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <Header jobs={jobs} />

      <ToastContainer />

      <section className="pt-20 md:pt-40 pb-10 md:pb-20 flex flex-col items-center justify-center text-center px-4">
        <p className="text-xl md:text-2xl"> Speed Up Your Job Search </p>
        <p className="text-4xl md:text-7xl font-bold mt-2"> 10x faster </p>
        <p className="text-xs mt-2 text-gray-600">
          {" "}
          We provide powerful features to streamline your job{" "}
          <br className="hidden md:block" /> applications and increase your
          chances of success{" "}
        </p>
      </section>

      <Insights />

      <section className="flex flex-col space-y-4 mt-10 mb-10 md:mb-20 items-center w-[90%] mx-auto px-4 md:px-0">
        {/* Header Section */}
        <div className="">
          <div className="flex flex-col items-center space-y-2 mt-5">
            <p className="text-xl sm:text-2xl md:text-4xl font-semibold text-center ">
              Explore the Latest Job Opportunities
            </p>
            <p className="text-sm sm:text-sm md:text-sm text-gray-400 text-center ">
              Find Your Perfect Job, Internship, or Career Breakthrough
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6">
            {/* Jobs Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Jobs</h3>
              {jobs.slice(0, 2).map((job, index) => (
                <div key={index} className="w-full">
                  <HomeCard
                    application={{ ...job, ...job?.job_data }}
                    handleCardClick={() => {}}
                    isSaved={undefined}
                  />
                </div>
              ))}
            </div>

            {/* Internships Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Internships</h3>
              {internships.slice(2, 4).map((internship, index) => (
                <div key={index} className="w-full">
                  <HomeCard
                    application={{
                      ...internship.internship_data,
                      total_views: internship.total_views,
                      type: "internship",
                      ...internship,
                    }}
                    handleCardClick={() => {}}
                    isSaved={undefined}
                  />
                </div>
              ))}
            </div>

            {/* Exams Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Exams</h3>
              {exams.slice(0, 2).map((exam, index) => (
                <div key={index} className="w-full">
                  <HomeCard
                    application={{
                      title: exam.exam_data.exam_title || "Exam Title", // Fallback to a default value
                      company_name: exam.exam_data.organization || "Organization Name", // Adjust field names as necessary
                      location: exam.exam_data.exam_centers || "Exam Centers",
                      job_description: exam.exam_data.about_exam || "About Exam",
                      updated_at: exam.exam_data.application_deadline,
                      views: exam.exam_data.views || 0,
                      status: exam.status || "Active",
                      _id: exam._id,
                      type: "exam",
                    }}
                    handleCardClick={() => {}}
                    isSaved={undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Thatabout
        achieversImages={[...achievements.map((achiever) => achiever.photo)]}
        achievements={achievements}
      />

      <AboutCCE mentors={mentors} />

      <FAQSection />

      <ContactSection
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1e2939a8] z-60 px-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Confirm Your Job Application
            </h2>
            <p className="mb-4 text-sm md:text-base">
              Did you complete your job application for "
              {unconfirmedJob?.job_data?.title}"?
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
              >
                Yes, Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

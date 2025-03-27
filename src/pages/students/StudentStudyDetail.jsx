import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { ChevronLeft, ChevronRight, Play, Plus, Trash, Edit, X } from 'lucide-react';
import { LoaderContext } from "../../components/Common/Loader";
import ReactPlayer from 'react-player';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import youtubeIcon from '../../assets/icons/youtube (2).png';
import driveIcon from '../../assets/icons/drive.png';
import googleIcon from '../../assets/icons/google.png';
import docsIcon from '../../assets/icons/docs.png';
import othersIcon from '../../assets/images/others.png';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// Updated YouTube video ID extraction
const getYouTubeVideoId = (url) => {
  try {
    const lowercaseUrl = url.toLowerCase();
    const urlObj = new URL(url);

    // Handle different YouTube URL formats
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.substring(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.includes('/shorts/')) {
        return urlObj.pathname.split('/shorts/')[1];
      } else if (urlObj.pathname.includes('/embed/')) {
        return urlObj.pathname.split('/embed/')[1];
      } else {
        return urlObj.searchParams.get('v');
      }
    }
    return null;
  } catch (error) {
    console.error('Invalid YouTube URL:', url);
    return null;
  }
};

// Updated Drive file ID extraction
const getDriveFileId = (url) => {
  try {
    const lowercaseUrl = url.toLowerCase();
    const urlObj = new URL(url);
    
    // Handle various Google Workspace URLs
    const patterns = {
      'drive.google.com': {
        file: '/file/d/',
        folder: '/folders/',
        view: '/view',
        uc: '/uc'
      },
      'docs.google.com': '/document/d/',
      'sheets.google.com': '/spreadsheets/d/',
      'forms.google.com': '/forms/d/',
      'slides.google.com': '/presentation/d/'
    };

    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;

    if (hostname.includes('drive.google.com')) {
      if (pathname.includes(patterns['drive.google.com'].file)) {
        return pathname.split(patterns['drive.google.com'].file)[1].split('/')[0];
      }
      if (pathname.includes(patterns['drive.google.com'].folder)) {
        return pathname.split(patterns['drive.google.com'].folder)[1].split('/')[0];
      }
      if (pathname === patterns['drive.google.com'].uc) {
        return urlObj.searchParams.get('id');
      }
    }

    // Handle other Google Workspace URLs
    for (const [domain, pattern] of Object.entries(patterns)) {
      if (hostname.includes(domain) && typeof pattern === 'string' && pathname.includes(pattern)) {
        return pathname.split(pattern)[1].split('/')[0];
      }
    }

    return null;
  } catch (error) {
    console.error('Invalid Drive URL:', url);
    return null;
  }
};

// Add these utility functions near the top of the file
const isEmptyOrWhitespace = (str) => !str || str.trim().length === 0;

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const validateLink = (link) => {
  if (isEmptyOrWhitespace(link.topic)) {
    toast.error('Topic cannot be empty or contain only whitespace');
    return false;
  }
  if (isEmptyOrWhitespace(link.link)) {
    toast.error('Link cannot be empty or contain only whitespace');
    return false;
  }
  if (!isValidUrl(link.link)) {
    toast.error('Please enter a valid URL');
    return false;
  }
  if (isEmptyOrWhitespace(link.type)) {
    toast.error('Please select a link type');
    return false;
  }

  // Specific validation for YouTube links
  if (link.type === 'YouTube' && !link.link.includes('youtube.com') && !link.link.includes('youtu.be')) {
    toast.error('Please enter a valid YouTube URL');
    return false;
  }

  // Specific validation for Drive links
  if (link.type === 'Drive' && !link.link.includes('drive.google.com')) {
    toast.error('Please enter a valid Google Drive URL');
    return false;
  }

  return true;
};

// Add this validation function at the top with other utility functions
const validateAllFields = (card) => {
  if (!card) return false;
  
  // Check title and description
  if (isEmptyOrWhitespace(card.title)) {
    toast.error('Title cannot be empty or contain only whitespace');
    return false;
  }
  if (isEmptyOrWhitespace(card.description)) {
    toast.error('Description cannot be empty or contain only whitespace');
    return false;
  }

  // Check all links
  if (card.links && card.links.length > 0) {
    for (let i = 0; i < card.links.length; i++) {
      const link = card.links[i];
      if (isEmptyOrWhitespace(link.topic)) {
        toast.error(`Link ${i + 1} has an empty topic`);
        return false;
      }
      if (isEmptyOrWhitespace(link.link)) {
        toast.error(`Link ${i + 1} has an empty URL`);
        return false;
      }
      if (isEmptyOrWhitespace(link.type)) {
        toast.error(`Link ${i + 1} has no type selected`);
        return false;
      }
    }
  }
  return true;
};

export default function StudentStudyDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('Exam');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const [newLink, setNewLink] = useState({ topic: '', link: '', type: '' });
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [showLinksList, setShowLinksList] = useState(false);
  const [selectedLinkType, setSelectedLinkType] = useState('');
  const [linksList, setLinksList] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalCard, setOriginalCard] = useState({});

  const TITLE_MAX_LENGTH = 50;
  const DESCRIPTION_MAX_LENGTH = 200;
  const LINK_TOPIC_MAX_LENGTH = 50; // Add this new constant

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(!decodedToken.student_user ? decodedToken.role : "student");
    }
  }, []);

  // useEffect(() => {
  //   const fetchStudyMaterials = async () => {
  //     setIsLoading(true);
  //     const token = Cookies.get("jwt");
  //     const headers = { Authorization: `Bearer ${token}` };
  //     try {
  //       const response = await axios.get('http://localhost:8000/api/study-materials/', { headers });
  //       setStudyMaterials(response.data);
  //     } catch (error) {
  //       console.error('Error fetching study materials:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchStudyMaterials();
  // }, [setIsLoading]);

  const fetchCardDetails = async () => {
    setIsLoading(true);
    const token = Cookies.get("jwt");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.get(`${API_BASE_URL}/api/study-material/${id}/`, { headers });
      const data = response.data.study_material || { links: [] }; // Use nested study_material with fallback
      setEditedCard(data);
      sessionStorage.setItem('savedStudyMaterial', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching card details:', error);
      setEditedCard({ links: [] }); // Fallback to empty object with links
      toast.error("Failed to load study material");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCardDetails();
  }, [id, setIsLoading]);

  useEffect(() => {
    if (editedCard && editedCard.links) {
      const ytLinks = editedCard.links.filter(link => link.type === 'YouTube');
      setYoutubeLinks(ytLinks);
      if (ytLinks.length > 0 && !selectedVideo) {
        setSelectedVideo(ytLinks[0]);
      }
    }
  }, [editedCard, selectedVideo]);

  const updateCategories = (materials, type) => {
    const filteredMaterials = materials.filter(material => material.type === type);
    const uniqueCategories = [...new Set(filteredMaterials.map(item => item.category))].sort();
    setCategories(uniqueCategories);
    if (uniqueCategories.length > 0) {
      setSelectedCategory(uniqueCategories[0]);
    }
  };

  const changeType = (direction) => {
    const types = ['Exam', 'Subject', 'Topic'];
    const currentIndex = types.indexOf(selectedType);
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = types.length - 1;
    else if (newIndex >= types.length) newIndex = 0;
    setSelectedType(types[newIndex]);
  };

  useEffect(() => {
    if (editedCard && editedCard.links) {
      updateCategories(editedCard.links, selectedType);
    }
  }, [selectedType, editedCard]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title' && value.length > TITLE_MAX_LENGTH) {
      toast.error(`Title cannot exceed ${TITLE_MAX_LENGTH} characters`);
      return;
    }
    if (name === 'description' && value.length > DESCRIPTION_MAX_LENGTH) {
      toast.error(`Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`);
      return;
    }
    setHasChanges(true);
    setEditedCard(prev => ({ ...prev, [name]: value }));
  };

  const handleNewLinkChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'topic' && value.length > LINK_TOPIC_MAX_LENGTH) {
      toast.error(`Topic cannot exceed ${LINK_TOPIC_MAX_LENGTH} characters`);
      return;
    }

    if (name === 'type' && value === 'Others') {
      setNewLink(prev => ({ ...prev, [name]: value }));
      return;
    }

    if (name === 'link' && value.includes('drive.google.com')) {
      const fileId = getDriveFileId(value);
      if (fileId) {
        const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
        setNewLink(prev => ({ ...prev, link: downloadLink, type: 'Drive' }));
        return;
      }
    }
    setNewLink(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLink = () => {
    const trimmedNewLink = {
      topic: newLink.topic?.trim(),
      link: newLink.link?.trim(),
      type: newLink.type
    };

    if (!validateLink(trimmedNewLink)) {
      return;
    }

    setHasChanges(true);
    setEditedCard(prev => ({
      ...prev,
      links: [...(prev.links || []), trimmedNewLink]
    }));
    setNewLink({ topic: '', link: '', type: '' });
    toast.success('Link added successfully');
  };

  const handleDeleteLink = (index) => {
    setHasChanges(true);
    setEditedCard(prev => {
      const updatedLinks = [...(prev.links || [])];
      updatedLinks.splice(index, 1);
      return { ...prev, links: updatedLinks };
    });
  };

  const handleSaveChanges = async () => {
    if (!validateAllFields(editedCard)) {
      return;
    }

    // Validate all links
    for (const link of editedCard.links || []) {
      if (!validateLink(link)) {
        return;
      }
    }

    const token = Cookies.get("jwt");
    const headers = { Authorization: `Bearer ${token}` };
    
    // Clean up whitespace before saving
    const cleanedCard = {
      ...editedCard,
      title: editedCard.title.trim(),
      description: editedCard.description.trim(),
      links: editedCard.links.map(link => ({
        ...link,
        topic: link.topic.trim(),
        link: link.link.trim()
      }))
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/study-material-edit/${editedCard._id}/`,
        cleanedCard,
        { headers }
      );

      if (response.status === 200) {
        const savedData = response.data.study_material;

        // Update all states with saved data
        setEditedCard(savedData);
        setOriginalCard(savedData);

        // Update YouTube links
        const ytLinks = savedData.links?.filter(link => link?.type === 'YouTube') || [];
        setYoutubeLinks(ytLinks);

        // Update location state
        if (location.state) {
          location.state.card = savedData;
        }

        setIsEditing(false);
        setHasChanges(false);
        toast.success("Changes saved successfully!");
      }
    } catch (error) {
      console.error("Error updating study material:", error);
      toast.error(error.response?.data?.error || "Failed to save changes");
    }
  };

  useEffect(() => {
    const loadSavedData = () => {
      const savedData = sessionStorage.getItem('savedStudyMaterial');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const data = parsedData.study_material || parsedData || { links: [] }; // Handle nested or flat structure
        setEditedCard(data);
        const ytLinks = data.links?.filter(link => link.type === 'YouTube') || [];
        setYoutubeLinks(ytLinks);
        if (ytLinks.length > 0) {
          setSelectedVideo(ytLinks[0]);
        }
      }
    };

    loadSavedData();

    return () => {
      sessionStorage.removeItem('savedStudyMaterial');
    };
  }, []);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewLink({ topic: '', link: '', type: '' });
    fetchCardDetails();
  };

  const handleToggleStatus = async (material) => {
    const updatedStatus = material.status === "active" ? "inactive" : "active";
    try {
      await axios.put(`${API_BASE_URL}/api/study-materials/${material._id}/update/`, { status: updatedStatus });
      setEditedCard(prev => ({ ...prev, status: updatedStatus }));
    } catch (error) {
      console.error("Error updating study material status:", error);
    }
  };

  const handleDeleteMaterial = async (id) => {
    const token = Cookies.get("jwt");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/study-material-delete/${id}/`, { headers });
      if (response.status === 200) {
        navigate(-1);
        toast.success("Material deleted successfully!");
      } else {
        toast.error("Failed to delete material.");
      }
    } catch (error) {
      console.error('Error deleting study material:', error);
      toast.error("Failed to delete material.");
    }
  };

  if (isLoading || !editedCard) {
    return <div>Loading...</div>;
  }
  const LinksModal = ({ links, type, onClose }) => {
    const getLinkIcon = (linkType) => {
      switch (linkType) {
        case 'Google': return googleIcon;
        case 'YouTube': return youtubeIcon;
        case 'Drive': return driveIcon;
        case 'TextContent': return docsIcon;
        case 'Others': return othersIcon;
        default: return null;
      }
    };

    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/90 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{type} Links</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-2">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 hover:bg-gray-100/80 rounded text-blue-600 hover:text-blue-800"
              >
                <img src={getLinkIcon(link.type)} alt={link.type} className="w-5 h-5" />
                {link.topic || `${type} Link ${index + 1}`}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster position="top-right" />
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {userRole === "student" && <StudentPageNavbar />}
        <div className="flex-1 px-8 overflow-hidden">
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex flex-col justify-between py-6">
              <h1 className="text-xl font-semibold">Study Material</h1>
            </div>
            <div className="flex-1 overflow-hidden ">
              <div className='relative border border-gray-300 p-6  max-w-8xl rounded-lg h-23/24'>
                <div className='flex justify-between items-center mb-4'>
                  {isEditing ? (
                    <div className="w-full">
                      <input
                        type="text"
                        name="title"
                        value={editedCard.title || ''}
                        onChange={handleInputChange}
                        maxLength={TITLE_MAX_LENGTH}
                        className="border rounded px-2 py-1 w-full text-lg font-semibold"
                      />
                      <span className="text-xs text-gray-500">
                        {(editedCard.title || '').length}/{TITLE_MAX_LENGTH}
                      </span>
                    </div>
                  ) : (
                    <h1 className="text-xl font-semibold">{editedCard.title || 'Untitled'}</h1>
                  )}
                  {!isEditing && userRole !== "student" && (
                    <div className="flex gap-4">
                      <button
                        className="text-[#00FFBF] hover:text-[#00FFBF] flex items-center gap-1"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit size={20} color="black" />
                      </button>
                      <button
                        className="text-[#FF003F] hover:text-red-700 flex items-center gap-1"
                        onClick={() => handleDeleteMaterial(editedCard?._id)} // Added optional chaining
                        disabled={!editedCard} // Disable if editedCard is null
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  {isEditing ? (
                    <div>
                      <textarea
                        name="description"
                        value={editedCard.description || ''}
                        onChange={handleInputChange}
                        maxLength={DESCRIPTION_MAX_LENGTH}
                        className="border rounded px-2 py-1 w-full"
                        rows="4"
                      />
                      <span className="text-xs text-gray-500 absolute bottom-2 right-2">
                        {(editedCard.description || '').length}/{DESCRIPTION_MAX_LENGTH}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-7">{editedCard.description || 'No description'}</p>
                  )}
                </div>
                <div className={`flex space-x-4 mt-4 ${userRole === "student" ? "justify-end" : ""}`}>
                  {editedCard.links?.some(link => link.type === 'Google' && link.link?.trim()) && (
                    <button
                      onClick={() => {
                        const websiteLinks = editedCard.links.filter(link => 
                          link.type === 'Google' && link.link?.trim());
                        if (websiteLinks.length > 0) {
                          setLinksList(websiteLinks);
                          setSelectedLinkType('Website');
                          setShowLinksList(true);
                        }
                      }}
                    >
                      <img src={googleIcon} alt="Website" className="w-8 h-8" />
                    </button>
                  )}
                  {editedCard.links?.some(link => link.type === 'YouTube' && link.link?.trim()) && (
                    <button
                      onClick={() => {
                        const youtubeLinks = editedCard.links.filter(link => 
                          link.type === 'YouTube' && link.link?.trim());
                        if (youtubeLinks.length > 0) {
                          setLinksList(youtubeLinks);
                          setSelectedLinkType('YouTube');
                          setShowLinksList(true);
                        }
                      }}
                    >
                      <img src={youtubeIcon} alt="YouTube" className="w-10 h-8" />
                    </button>
                  )}
                  {editedCard.links?.some(link => link.type === 'Drive' && link.link?.trim()) && (
                    <button
                      onClick={() => {
                        const driveLinks = editedCard.links.filter(link => 
                          link.type === 'Drive' && link.link?.trim());
                        if (driveLinks.length > 0) {
                          setLinksList(driveLinks);
                          setSelectedLinkType('Drive');
                          setShowLinksList(true);
                        }
                      }}
                    >
                      <img src={driveIcon} alt="Drive" className="w-8 h-8" />
                    </button>
                  )}
                  {editedCard.links?.some(link => link.type === 'TextContent' && link.link?.trim()) && (
                    <button
                      onClick={() => {
                        const textLinks = editedCard.links.filter(link => 
                          link.type === 'TextContent' && link.link?.trim());
                        if (textLinks.length > 0) {
                          setLinksList(textLinks);
                          setSelectedLinkType('TextContent');
                          setShowLinksList(true);
                        }
                      }}
                    >
                      <img src={docsIcon} alt="TextContent" className="w-9 h-8" />
                    </button>
                  )}
                  {editedCard.links?.some(link => link.type === 'Others' && link.link?.trim()) && (
                    <button
                      onClick={() => {
                        const otherLinks = editedCard.links.filter(link => 
                          link.type === 'Others' && link.link?.trim());
                        if (otherLinks.length > 0) {
                          setLinksList(otherLinks);
                          setSelectedLinkType('Others');
                          setShowLinksList(true);
                        }
                      }}
                    >
                      <img src={othersIcon} alt="Others" className="w-8 h-8" />
                    </button>
                  )}
                </div>

                {youtubeLinks.length > 0 && (
                  <div className="mt-6 h-[calc(100%-200px)]">
                    <h2 className="text-lg font-medium mb-3">YouTube Videos</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {youtubeLinks.map((link, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedVideo(link)}
                          className={`px-4 py-2 rounded-md flex items-center gap-2 ${selectedVideo === link ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                          <Play size={16} />
                          {link.topic || `Video ${index + 1}`}
                        </button>
                      ))}
                    </div>
                    {selectedVideo && (
                      <div className="flex justify-center h-full max-h-[400px]">
                        <ReactPlayer
                          url={selectedVideo.link}
                          controls
                          width="70%"
                          height="92%"
                        />
                      </div>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-lg font-medium">Add New Link</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="topic"
                          value={newLink.topic}
                          onChange={handleNewLinkChange}
                          placeholder="Topic"
                          maxLength={LINK_TOPIC_MAX_LENGTH}
                          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          name="link"
                          value={newLink.link}
                          onChange={handleNewLinkChange}
                          placeholder="Link"
                          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <select
                        name="type"
                        value={newLink.type}
                        onChange={handleNewLinkChange}
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="Google">Website Link</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Drive">Drive</option>
                        <option value="TextContent">Text Content</option>
                        <option value="Others">Others</option>
                      </select>
                      <button
                        onClick={handleAddLink}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm w-fit self-end"
                      >
                        <Plus size={16} />
                        Add Link
                      </button>
                    </div>
                  </div>
                )}

                {isEditing && editedCard?.links?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Added Links</h3>
                    <ul>
                      {(editedCard.links || []).map((link, index) => (
                        <li key={index} className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <img 
                              src={
                                link.type === 'YouTube' ? youtubeIcon :
                                link.type === 'Drive' ? driveIcon :
                                link.type === 'Google' ? googleIcon :
                                link.type === 'TextContent' ? docsIcon :
                                othersIcon
                              } 
                              alt={link.type} 
                              className="w-5 h-5"
                            />
                            <span>{link.topic || `Link ${index + 1}`}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteLink(index)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm px-2 py-1"
                          >
                            <Trash size={14} /> Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isEditing && (
                  <div className="mt-8 flex justify-center gap-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded text-sm"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-1.5 px-3 rounded text-sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLinksList && (
        <LinksModal
          links={linksList}
          type={selectedLinkType}
          onClose={() => {
            setShowLinksList(false);
            setLinksList([]);
            setSelectedLinkType('');
          }}
        />
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";

export default function ContactMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = Cookies.get("jwt");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/get-contact-messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <SuperAdminPageNavbar />

      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white border-r border-[#000000]/30 overflow-hidden flex flex-col">
        <div className="p-4 ml-10 border-b border-[#000000]/30">
          <h2 className="text-xl font-bold text-gray-800">Contact Messages</h2>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search Messages"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 pl-8 border border-[#000000]/30 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <FaSearch className="absolute left-2.5 top-3 text-gray-400" />
          </div>
        </div>

        <div className="overflow-y-auto ml-10 flex-1 custom-scrollbar">
          {messages.length > 0 ? (
            messages
              .filter((msg) =>
                msg.name && msg.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map((message) => {
                const dateLabel = formatDate(message.timestamp);

                return (
                  <div
                    key={message._id}
                    className="p-3 border-b border-[#000000]/30 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-center">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">
                          {message.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {message.message}
                        </div>
                        <div className="text-xs text-gray-400">
                          {dateLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500 text-center py-4">No messages found</p>
          )}
        </div>
      </div>

      {/* Preview Pane */}
      <div className="w-full md:w-3/4 p-4 bg-white">
        {selectedMessage ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedMessage.name}
            </h3>
            <p className="text-gray-600">{selectedMessage.message}</p>
            <p className="text-xs text-gray-400">{formatDate(selectedMessage.timestamp)}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Select a message to see the preview
          </p>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
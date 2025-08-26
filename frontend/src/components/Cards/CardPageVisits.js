"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function CardPageVisits() {
  const { token, API_BASE_URL } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      } else {
        console.error("Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-blueGray-700">
              Latest Announcements
            </h3>
            <p className="text-sm text-blueGray-500">Stay updated with the latest news and updates</p>
          </div>
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <button
              className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={fetchAnnouncements}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      <div className="block w-full overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <p className="mt-2 text-sm text-blueGray-500">Loading announcements...</p>
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4 p-4">
              {announcements.map((announcement, index) => (
                <div key={index} className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📢</span>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-semibold text-blueGray-800 mb-1">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-blueGray-600 mb-2 leading-relaxed">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-blueGray-500">
                        {new Date(announcement.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blueGray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📢</span>
              </div>
              <h3 className="text-lg font-medium text-blueGray-700 mb-2">No announcements yet</h3>
              <p className="text-sm text-blueGray-500">Check back later for updates and news.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

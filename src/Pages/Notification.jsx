// src/Pages/Notification.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

const API_BASE_URL = "http://localhost:39189/notification"; // Adjust as needed

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Helper function to get icon based on status
  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return "⏳"; // Waiting symbol
      case "paid":
        return "✅"; // Ticked checkmark
      case "failed":
        return "❌"; // Failed symbol
      case "expired":
        return "⌛"; // Expired operation symbol
      case "reminder":
      default:
        return "🔔"; // Reminder uses the yellow bell
    }
  };

  useEffect(() => {
    if (!token) {
      console.log("No token found for notifications.");
      return;
    }
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        // Sort notifications by send_at (or created_at) descending
        const sortedData = data.sort(
          (a, b) => new Date(b.send_at || b.created_at) - new Date(a.send_at || a.created_at)
        );
        setNotifications(sortedData);
      } catch (err) {
        console.log("Error fetching notifications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  // Update a single notification to "read"
  const markAsRead = async (notificationId) => {
    // Optimistically update the UI
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === notificationId
          ? { ...notification, read_status: "read" }
          : notification
      )
    );
    // Send update request to the backend
    try {
      const response = await fetch(`${API_BASE_URL}/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read_status: "read" })
      });
      if (!response.ok) {
        throw new Error("Failed to update notification");
      }
    } catch (err) {
      console.log("Error marking notification as read:", err);
      // Optionally revert the optimistic update if needed
    }
  };

  // Batch update: mark all notifications as "read" for the user
  const markAllAsReadBatch = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/read-all`, { // Updated endpoint
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }
      // Update local state: set all notifications' read_status to "read"
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read_status: "read" }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Filter notifications based on selected filter (all, unread, or read)
  const filteredNotifications = notifications.filter(notification => {
    if (filterStatus === "all") return true;
    return notification.read_status === filterStatus;
  });

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notification</h1>
        <button 
          className="text-blue-600 font-medium" 
          onClick={markAllAsReadBatch}
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter by status:</label>
        <select
          id="filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-1 border rounded"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {loading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => navigate(`/course/${notification.course_id}`)}
                title="Click to view course" // Tooltip on hover
                className={`cursor-pointer p-4 border rounded flex justify-between items-center transition-colors ${
                  notification.read_status === "unread"
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-xl">
                    {getStatusIcon(notification.status)}
                  </span>
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-600">
                      {dayjs(notification.send_at || notification.created_at).fromNow()}
                    </p>
                  </div>
                </div>
                {notification.read_status === "unread" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); markAsRead(notification._id); }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No notifications found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;

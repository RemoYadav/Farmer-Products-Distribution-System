import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  // fetch notifications list
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch notification count
  const fetchCount = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/notifications/count`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // mark all as read + refresh
  const markAllRead = async () => {
    await axios.put(
      `${API_BASE_URL}/api/notifications/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCount(0);
    fetchNotifications(); // refresh list
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, [token, API_BASE_URL]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        count,
        open,
        setOpen,
        fetchNotifications,
        markAllRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

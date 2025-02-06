import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setName] = useState("");
  const [isDataUpdated, setDataUpdated] = useState(false);
  const [currentPage, setcurrentPage] = useState(1);
  const [dataPerPage] = useState(15);
  const [selectedUser, setSelectedUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isEditing, setisEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    getUserDetails();
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );
      getUserDetails();
    } catch (error) {
      console.log(error);
      throw new Error(error.response.data.detail);
    }
  };
  const getUserDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/current-user-details`, {
        withCredentials: true,
      });
      setName(response.data.name);
      setUserRole(response.data.role);
      setUserEmail(response.data.email);
    } catch (error) {
      console.log("Axios error:", error.response.data.detail);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        login,
        userRole,
        userEmail,
        userName,
        isDataUpdated,
        setDataUpdated,
        dataPerPage,
        currentPage,
        setcurrentPage,
        selectedUser,
        setSelectedUser,
        visible,
        setVisible,
        setCurrentUser,
        isEditing,
        setisEditing,
        currentUser,
        setUserEmail,
        isLoading,
        setUserRole,
        API_BASE_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

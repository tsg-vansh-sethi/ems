import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "../pages/Login.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import PageNotFound from "../pages/PageNotFound.jsx";
import Profile from "../components/Profile.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
function AppRouter() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  //An Axios Interceptor is a function that runs before a request is sent or after a response is received.
  // It allows you to modify, handle errors, or add global behavior to every API call made using Axios.
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute
            element={<Login />}
            requireAuth={false}
            redirectTo="/dashboard"
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute
            element={<AdminDashboard />}
            requireAuth={true}
            redirectTo="/"
          />
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRouter;

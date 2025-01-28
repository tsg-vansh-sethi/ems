import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Login from "./pages/Login.jsx";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Profile from "./components/Profile.jsx";
function App() {
  return (
    <>
      {/* <Login/> */}
      {/* in routes we specify Different routes we have */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/myprofile" element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

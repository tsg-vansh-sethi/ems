import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.jsx";
function App() {
  return (
    <>
      {/* <Login/> */}
      {/* in routes we specify Different routes we have */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

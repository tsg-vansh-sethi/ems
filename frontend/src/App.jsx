import Login from "./pages/Login.jsx";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./utils/AppRouter.jsx";
function App() {
  return (
    <>
      {/* <Login/> */}
      {/* in routes we specify Different routes we have */}
      <BrowserRouter>
        {/* BrowserRouter keeps track of different routes and links we have in our website */}
        <AppRouter />
      </BrowserRouter>
    </>
  );
}

export default App;

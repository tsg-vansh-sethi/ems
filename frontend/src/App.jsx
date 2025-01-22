import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'
import {Route,Routes} from 'react-router-dom'
import {BrowserRouter} from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard.jsx'
function App() {
  return(
    <>
    {/* <Login/> */}
    {/* in routes we specify Different routes we have */}
    <BrowserRouter>
    <Routes>    
    <Route path='/' element={<Login/>}/>
    <Route path='/signup' element={<SignUp/>}/>
    <Route path='/dashboard' element={<AdminDashboard/>}/>      
    <Route path='*' element={<Login/>}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App

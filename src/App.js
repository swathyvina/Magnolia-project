import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import NavbarHero from "./components/NavbarHero";
import TestForm from "./components/TestAddForm";



function App() {
  const [showForm, setShowForm] = useState(true);
  return (
    <>
    <Router>
      <Routes>
        {/* Default route to Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Route for NavbarHero after login */}
        <Route path="/NavbarHero" element={<NavbarHero/>} />

      </Routes>
    </Router>
    <div>
      {/* {showForm && <TestForm toggleForm={setShowForm} />} */}
    </div>
    
   
    </>
    
  );
}

export default App;

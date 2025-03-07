import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import TestTable from "./components/TestTable";
import TestForm from "./components/TestAddForm";
import Layout from "./components/Layout"; // Import the new Layout component

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/labtest" replace />} />  {/* Default route after login */}
          <Route path="labtest" element={<TestTable />} />
          <Route path="addtest" element={<TestForm />} />
          <Route path="TestTable" element={<TestTable />} />
          <Route path="addtest/:testId" element={<TestForm />} />
        </Route>

        {/* If no route matches, redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./TestTable.css";
import { IoMdMenu } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";

const TestTable = () => {
  const [tests, setTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function
 

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch(
        "https://api.teknologiunggul.com/entities/filter/lab_test",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            orgid: "intern_test",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        console.error(`Tests fetch error! Status: ${response.status}`);
        return;
      }

      const res = await response.json();
      if (res && res.data && res.data.length > 0 && res.data[0]?.response) {
        setTests(res.data[0].response);
      } else {
        setTests([]);
        console.error("Unexpected API response structure:", res);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };


 

  const handleDelete = async (testId) => {
    if (!token) {
      console.error("Auth Token Missing");
      return;
    }

    try {
      const response = await fetch(
        `https://api.teknologiunggul.com/entities/lab_test/${testId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            orgid: "intern_test",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to delete: ${response.statusText}`
        );
      }

      console.log(`Lab Test ID ${testId} deleted successfully`);
      setTests((prevTests) => prevTests.filter((test) => test._id !== testId));
    } catch (error) {
      console.error("Error deleting lab test:", error);
      alert("Failed to delete the test. Please try again.");
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.test_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.test_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    fetchTests();
  }, [navigate]); // Runs when navigating back after adding/updating
  
  

  return (
    <div className="table-container">
      <h1>TEST LIST</h1>
      <div className="search">
        <div className="left">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by ID or Name"
              className="search-input"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="show-btn" onClick={fetchTests}>
              <IoMdMenu /> SHOW
            </button>
          </div>
        </div>
        <div className="right">
          {/* Navigate to TestForm when clicking ADD NEW */}
          <button onClick={() => navigate("/addtest")}>ADD NEW</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="test-table">
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Name</th>
              <th>Short Name</th>
              <th>UOM</th>
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <tr key={test._id}>
                  <td>{test.test_id}</td>
                  <td>{test.test_name}</td>
                  <td>{test.short_name}</td>
                  <td>{test.uom || "N/A"}</td>
                  <td>{test.created_on || "-"}</td>
                  <td className="action">
                    <div className="dropdown-wrapper" style={{ position: "relative" }}>
                      <button
                        className="edit-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId((prevId) => (prevId === test._id ? null : test._id));
                        }}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {openMenuId === test._id && (
                        <div className="popup-menu" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => navigate(`/addtest/${test._id}`)}>Edit</button>
                          <button onClick={() => handleDelete(test._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No tests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestTable;


import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { LuArrowDownToLine, LuFilterX } from "react-icons/lu";
import { MdRefresh } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import DateRangePicker from "./DateRangePicker";
import "./UserGroup.css";
import SideBar from "./SideBar";

const UserGroup = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(3);
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("authToken")) || null;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        console.error("Auth Token Missing");
        return;
      }

      try {
        const response = await fetch(
          "https://api.teknologiunggul.com/entities/filter/usergroups",
          {
            method: "POST",
            headers: {
              Authorization: Bearer ${token},
              "Content-Type": "application/json",
              orgid: "intern_test",
            },
            body: JSON.stringify({}),
          }
        );

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (
          data.status === 200 &&
          data.data.length > 0 &&
          data.data[0].response
        ) {
          const transformedData = data.data[0].response.map((user) => ({
            id: user._id,
            name: user.groupName,
            role: user.roleId,
            status: user.status,
            created_at: user.created_on,
          }));

          setUsers(transformedData);
        } else {
          console.error("No user data received");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (userId) => {
    if (!token) {
      console.error("Auth Token Missing");
      return;
    }
  
    try {
      const response = await fetch(
        https://api.teknologiunggul.com/entities/usergroups/${userId},
        {
          method: "DELETE",
          headers: {
            Authorization: Bearer ${token},
            "Content-Type": "application/json",
            orgid: "intern_test",
          },
        }
      );
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("User deleted successfully:", result);
        setUsers(users.filter((user) => user.id !== userId)); // Update frontend state
      } else {
        console.error("Failed to delete user:", result.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  

  const handleEdit = (userId) => {
    const selectedUser = users.find((user) => user.id === userId);
    if (selectedUser) {
      navigate("/update-group", { state: { user: selectedUser } });
    }
  };
  

  const handleCreate = () => navigate("/new-group");

  const toggleMenu = (userId) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".action-cell")) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="container">
      <SideBar />
      <div className="right">
        <div className="top">
          <div className="user-left">
            <div className="date">
              <DateRangePicker />
            </div>
            <div className="name-filter">
              <input type="text" placeholder="Search By Name" />
              <CiSearch className="search-icon" />
            </div>
          </div>
          <div className="user-right">
            <button className="create" onClick={handleCreate}>
              CREATE <FaPlus />
            </button>
            <button className="export">
              EXPORT <LuArrowDownToLine />
            </button>
            <button className="more-filter">MORE FILTERS</button>
            <button className="filter">
              <LuFilterX />
            </button>
            <button className="refresh">
              <MdRefresh />
            </button>
          </div>
        </div>

        <div className="bottom-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td
                      className={
                        user.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {user.status}
                    </td>
                    <td>{new Date(user.created_at).toLocaleString()}</td>
                    <td className="action-cell">
                      <button
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(user.id);
                        }}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {openMenuId === user.id && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleEdit(user.id)}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(user.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bottom">
            <div className="bottom-left">
              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>

              <div className="select-by-user-limit">
                <label>Show: </label>
                <select
                  value={usersPerPage}
                  onChange={(e) => setUsersPerPage(Number(e.target.value))}
                >
                  <option value={3}>Auto</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            <div className="bottom-right">
              <h5>
                Showing {indexOfFirstUser + 1}-
                {Math.min(indexOfLastUser, users.length)} of {users.length}
              </h5>
              <p>Powered by CREDO PAY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGroup;

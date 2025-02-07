import { useState, useEffect, createContext, useContext } from "react";
import Pagination from "../components/pagination.jsx";
import AddEmployeeForm from "../components/addEmployeeForm.jsx";
import { GoSearch } from "react-icons/go";
import EditForm from "../components/EditForm.jsx";
import Profile from "../components/Profile.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider.jsx";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
export const userContext = createContext();
function AdminDashboard() {
  const navigate = useNavigate();

  const {
    isDataUpdated,
    setDataUpdated,
    setSelectedUser,
    selectedUser,
    setVisible,
    currentPage,
    setcurrentPage,
    dataPerPage,
    currentUser,
    setUserEmail,
    API_BASE_URL,
  } = useContext(AuthContext);
  const { userRole, userEmail, userName } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [start, setStart] = useState(0);
  const [limit] = useState(1000);
  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const [filterType, setFilterType] = useState("name");

  // for sorting
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // "asc", "desc", "none"
  const handleSort = (e) => {
    const columnName = e.target.innerText.trim().toLowerCase(); // Remove extra spaces
    const columnMap = {
      "phone number": "phoneNumber",
      "join date": "startingDate",
      name: "name",
      email: "email",
      address: "address",
      department: "department",
      role: "role",
    };
    const sortColumn = columnMap[columnName];
    if (!sortColumn) return; // Ignore clicks on invalid columns
    let newOrder;
    if (sortField === sortColumn) {
      if (sortOrder === null) newOrder = "asc";
      else if (sortOrder === "asc") newOrder = "desc";
      else newOrder = null;
    } else {
      newOrder = "asc"; // default to ascending on new column click
    }

    setSortField(sortColumn);
    setSortOrder(newOrder);
    fetchSortedUsers(sortColumn, newOrder);
  };
  const fetchSortedUsers = async (field, order) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/sorted-users?sort_by=${field}&order=${order}`
      );
      setData(response.data.users);
    } catch (error) {}
  };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setcurrentPage(1);
  };
  useEffect(() => {
    // deleteUsers();
    getAllUsers();
    // best approach is to update the previous data rather than re-rendering again like we did here
    // which will say us one db call
    // like one we are making add employee call in data()  we will have previous data
    setDataUpdated(false);
  }, [isDataUpdated]);
  // useEffect(() => {
  //   if (userEmail) {
  //     fetchUsers(); // Only call getData() when userEmail is available
  //   }
  // }, [isDataUpdated, userEmail]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllUsers`, {
        withCredentials: true,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/get-fake-users?start=${start}&limit=${limit}`
      );
      setData([...response.data.users]);
      setStart(start + limit); // Increment start index
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (email) => {
    try {
      await axios.delete(`${API_BASE_URL}/dashboard/${email}`, {
        withCredentials: true,
      });
      setDataUpdated(true);
      setSortField(null);
      setSortOrder(null);
      setFilterType("name");
    } catch (error) {
      console.error("Error fetching users:", error);
      // fetch(`http://127.0.0.1:8000/dashboard/${email}`, {
      //   method: "DELETE",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // })
      //   .then((response) => {
      //     if (response.ok) {
      //       setDataUpdated(true);
      //     }
      //   })
      //   .catch((error) => console.error("Error deleting employee:", error));
    }
  };
  const deleteUsers = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-users`, {
        withCredentials: true,
      });
      setData([]);
      setStart(0);
      setcurrentPage(1);
      setDataUpdated(true);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };
  const handleSignout = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/logout`, {
        withCredentials: true,
      });
      setUserEmail("");
      navigate("/");
    } catch (error) {
      throw new Error(error.response.data.detail);
    }
  };
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setVisible(true);
  };
  const fetchFilteredUsers = async () => {
    if (!searchText) getAllUsers();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/filter-users?filtertype=${filterType}&text=${searchText}`,
        {
          withCredentials: true,
        }
      );
      setData(response.data.users); // Update with filtered users
    } catch (error) {
      console.error("Error fetching filtered users:", error);
    }
  };
  const filteredDataLength = data.length;
  const currentData = data.slice(firstIndex, lastIndex);
  const renderTableRows = () => {
    if (currentData.length > 0) {
      return currentData.map((item) => (
        <tr key={item.email} className="border-b text-sm md:text-base">
          <td className="p-2">{item.name}</td>
          <td className="p-2">{item.email}</td>
          <td className="p-2">{item.phoneNumber}</td>
          <td className="p-2">{item.address}</td>
          <td className="p-2">{item.department}</td>
          <td className="p-2">{item.role}</td>
          <td className="p-2">{item.startingDate}</td>
          {userRole === "admin" && (
            <td className="p-2">
              <div className="flex flex-col md:flex-row gap-2">
                {userEmail != item.email && (
                  <button
                    onClick={() => handleEditClick(item)}
                    className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded-md hover:bg-blue-700 text-xs md:text-sm"
                  >
                    Edit
                  </button>
                )}
                {userEmail != item.email && (
                  <button
                    className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded-md hover:bg-red-700 text-xs md:text-sm"
                    onClick={() => handleDelete(item.email)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </td>
          )}
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan="8" className="text-center p-4 text-gray-500">
            No users found!!
          </td>
        </tr>
      );
    }
  };
  const checkSortOrder = (field) => {
    if (sortField !== field) return " "; // Show no icon for inactive columns
    if (sortOrder === "asc") return <FaArrowUpLong className="inline" />;
    if (sortOrder === "desc") return <FaArrowDownLong className="inline" />;
    return " ";
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-8xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 md:p-6 rounded-md shadow-md">
          <h2 className="text-lg md:text-xl font-bold">
            Hi {currentUser.name}!
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-3 mt-2 md:mt-0">
            <select
              className=" py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="role">Role</option>
              <option value="department">Department</option>
            </select>
            {/* Search Bar */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-auto bg-white shadow-sm transition-all">
              <GoSearch className="text-gray-500 mx-2 text-lg" />
              <input
                type="text"
                name="userInput"
                placeholder={`Search for ${filterType}...`}
                className=" rounded-md w-64 outline-none bg-transparent flex-1 placeholder-gray-400 text-gray-700 "
                onChange={handleSearch}
              />
            </div>
            <button
              onClick={fetchFilteredUsers}
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
            {userRole === "admin" && (
              <button
                onClick={fetchUsers}
                className="bg-blue-600 cursor-pointer text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm md:text-base"
              >
                Add Users
              </button>
            )}
            {userRole === "admin" && (
              <button
                onClick={deleteUsers}
                className="bg-green-600 cursor-pointer text-white px-3 py-2 rounded hover:bg-green-700 text-sm md:text-base"
              >
                Delete Users
              </button>
            )}
            {userRole === "admin" && <AddEmployeeForm />}
            <button
              className="bg-red-600 cursor-pointer text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm md:text-base"
              onClick={handleSignout}
            >
              Signout
            </button>
          </div>
        </div>

        <Profile />

        <div className="bg-white p-4 md:p-6 rounded-md shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-200 text-xs md:text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 cursor-pointer" onClick={handleSort}>
                  Name{checkSortOrder("name")}
                </th>
                <th
                  className="p-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleSort}
                >
                  Email{checkSortOrder("email")}
                </th>
                <th
                  className="p-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleSort}
                >
                  Phone Number
                  {checkSortOrder("phoneNumber")}
                </th>
                <th
                  className="p-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleSort}
                >
                  Address{checkSortOrder("address")}
                </th>
                <th
                  className="p-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleSort}
                >
                  Department
                  {checkSortOrder("department")}
                </th>
                <th
                  className="p-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleSort}
                >
                  Role{checkSortOrder("role")}
                </th>
                <th
                  className="p-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleSort}
                >
                  Join Date {checkSortOrder("startingDate")}
                </th>
                {userRole === "admin" && <th className="p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>

          <Pagination filteredDataLength={filteredDataLength} />
        </div>
      </div>

      {selectedUser && <EditForm />}
    </div>
  );
}

export default AdminDashboard;

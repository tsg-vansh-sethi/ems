import { useState, useEffect } from "react";
import Pagination from "../components/pagination.jsx";
import AddEmployeeForm from "../components/addEmployeeForm.jsx";
import { Link } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import EditForm from "../components/EditForm.jsx";
import Profile from "../components/Profile.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function AdminDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isDataUpdated, setDataUpdated] = useState(false);
  const [currentPage, setcurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const userEmail = localStorage.getItem("userEmail");
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("authToken");
  const name = localStorage.getItem("name");
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setcurrentPage(1);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    getData();
  }, [isDataUpdated]);

  const getData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/getAllUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.filter((item) => item.email !== userEmail));
    } catch (error) {
      console.error("Axios Error:", error.response.data);
    }
  };

  const handleDelete = async (email) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/dashboard/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDataUpdated(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired! Redirecting to login...");
        localStorage.removeItem("authToken");
        navigate("/");
        console.log("Axios Error:", error.response.data);
      }
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
  const handleSignout = () => {
    navigate("/");
  };
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setVisible(true);
  };
  const filteredData = data.filter((item) =>
    search.toLowerCase() === ""
      ? true
      : item.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentData = filteredData.slice(firstIndex, lastIndex);

  const renderTableRows = () => {
    return currentData.map((item) => (
      <tr key={item.email} className="border-b">
        <td className="p-2">{item.name}</td>
        <td className="p-2">{item.email}</td>
        <td className="p-2">{item.phoneNumber}</td>
        <td className="p-2">{item.address}</td>
        <td className="p-2">{item.department}</td>
        <td className="p-2">{item.role}</td>
        <td className="p-2">{item.startingDate}</td>
        <td className="p-2">
          {role === "admin" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(item)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                onClick={() => handleDelete(item.email)}
              >
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    ));
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex-column ">
        <div className="flex justify-between items-center bg-white p-6 rounded-md shadow">
          <h2 className="text-xl font-bold">Hi {name}!</h2>
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
            <GoSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              name="userInput"
              placeholder="Search For Employee"
              className="p-2 rounded-md w-lg outline-none flex-1 bg-transparent"
              onChange={handleSearch}
            />
          </div>

          <div className="flex items-center gap-4">
            {role === "admin" && (
              <AddEmployeeForm setDataUpdated={setDataUpdated} />
            )}
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              onClick={handleSignout}
            >
              Signout
            </button>
          </div>
        </div>
        <Profile role={role} sendEmail={userEmail} passToken={token} />
        <div className="mt-2 bg-white p-6 rounded-md shadow">
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone Number</th>
                <th className="p-2">Address</th>
                <th className="p-2">Department</th>
                <th className="p-2">Role</th>
                <th className="p-2">Join Date</th>
                {role === "admin" && <th className="p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>

          <Pagination
            dataLength={filteredData.length}
            dataPerPage={dataPerPage}
            currentPage={currentPage}
            setcurrentPage={setcurrentPage}
          />
        </div>
      </div>
      {selectedUser && (
        <EditForm
          user={selectedUser}
          visible={visible}
          setVisible={setVisible}
          setDataUpdated={setDataUpdated}
        />
      )}
    </div>
  );
}

export default AdminDashboard;

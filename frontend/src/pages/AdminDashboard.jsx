import { useState, useEffect } from "react";
import Pagination from "../components/pagination.jsx";
import AddEmployeeForm from "../components/addEmployeeForm.jsx";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
function AdminDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [role, setRole] = useState(null);
  const [isDataUpdated, setDataUpdated] = useState(false);
  const [currentPage, setcurrentPage] = useState(1);
  const [dataPerPage] = useState(10);

  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, [token]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setcurrentPage(1);
  };

  useEffect(() => {
    getData();
  }, [isDataUpdated]);

  const getData = () => {
    fetch("http://127.0.0.1:8000/getAllUsers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleDelete = (email) => {
    fetch(`http://127.0.0.1:8000/dashboard/${email}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setDataUpdated(true);
        }
      })
      .catch((error) => console.error("Error deleting employee:", error));
  };

  const handleClick = () => {
    navigate("/dashboard/myprofile");
  };
  const filteredData = data.filter((item) =>
    search.toLowerCase() === ""
      ? true
      : item.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentData = filteredData.slice(firstIndex, lastIndex);

  const renderTableRows = () => {
    return currentData.map((item) => (
      <tr key={item._id} className="border-b">
        <td className="p-2">{item._id}</td>
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
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                onClick={() => handleEdit(item.email)}
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
          <h2 className="text-xl font-bold">
            Hi {role === "admin" ? "Admin" : "Employee"}!
          </h2>
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
            <button
              onClick={handleClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              My Profile
            </button>
            {role === "admin" && (
              <AddEmployeeForm setDataUpdated={setDataUpdated} />
            )}
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              <Link to="/">Signout</Link>
            </button>
          </div>
        </div>
        <div className="mt-2 bg-white p-6 rounded-md shadow">
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
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
    </div>
  );
}

export default AdminDashboard;

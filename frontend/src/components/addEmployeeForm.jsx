import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import Alert from "@mui/material/Alert";
import axios from "axios";
function AddEmployeeForm(props) {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    department: "",
    startingDate: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };

  const closeForm = () => {
    setVisible(false);
  };

  const handleChange = (e) => {
    setOpenAlert(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/addemployee",
        formData
      );
      setVisible(false);
      props.setDataUpdated(true); // Trigger data update in the parent
    } catch (error) {
      console.log(error);
      const errorMessage = error.response.data.detail; // Get backend error or default message
      console.error("Axios Error:", errorMessage);

      setOpenAlert(true);
      setFormData({});
      setMessage(errorMessage); // Display error from backend
      props.setDataUpdated(true);
    }
    // fetch("http://127.0.0.1:8000/addemployee", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // })
    //   .then((response) => {
    //     if (response.ok) {
    //       return response.json();
    //     } else {
    //       throw new Error("Error adding employee");
    //     }
    //   })
    //   .then((data) => {
    //     setVisible(false);
    //     props.setDataUpdated(true); // Trigger data update in the parent
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add Employee
      </button>
      {openAlert && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <Alert
            severity="error"
            className="w-3/4 max-w-lg"
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {message}
          </Alert>
        </div>
      )}
      {visible && (
        <div className="fixed inset-0 bg-black-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Add New Employee</h1>
              <RxCross1
                className="text-xl cursor-pointer"
                onClick={closeForm}
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  placeholder="Enter department"
                  value={formData.department}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="startingDate"
                  className="block text-sm font-medium"
                >
                  Starting Date
                </label>
                <input
                  type="date"
                  id="startingDate"
                  name="startingDate"
                  value={formData.startingDate}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  placeholder="Enter role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Employee
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddEmployeeForm;

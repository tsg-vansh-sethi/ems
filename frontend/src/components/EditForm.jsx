import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
function EditForm(props) {
  const [formData, setFormData] = useState({ ...props.user });
  const closeForm = () => {
    if (props.setisEditing) {
      props.setisEditing(false);
    }
    if (props.setVisible) {
      props.setVisible(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault(); // The e.preventDefault() method prevents the default behavior of an event in JavaScript.
    //For forms, the default behavior is submitting the form and reloading the page. By using e.preventDefault(), you stop this default submission and allow JavaScript to handle the form data asynchronously.
    // try{
    //   const response=await axios.put("http://127.0.0.1:8000/dashboard/{email}",{

    //   })
    // }
    // if (props.setisEditing) {
    //   props.setisEditing(false);
    // }
    // if (props.setVisible) {
    //   props.setVisible(false);
    // }
  };
  return (
    <>
      {(props.isEditing || props.visible) && (
        <div className="fixed inset-0 bg-black-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Edit Employee</h1>
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
                  className="border p-2 w-full rounded-md disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={props.role === "employee"}
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
                  className="border p-2 w-full rounded-md  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={props.role === "employee"}
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
                  className="border p-2 w-full rounded-md  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={props.role === "employee"}
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
                  className="block text-sm font-medium "
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
                  className="border p-2 w-full rounded-md  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={props.role === "employee"}
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
                  type="text"
                  id="startingDate"
                  name="startingDate"
                  value={formData.startingDate}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-md  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={props.role === "employee"}
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
                  className="border p-2 w-full rounded-md  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={props.role === "employee"}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit Employee
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

export default EditForm;

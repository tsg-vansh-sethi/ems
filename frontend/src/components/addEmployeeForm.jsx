import { useState, useContext } from "react";
import { RxCross1 } from "react-icons/rx";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { AuthContext } from "./AuthProvider.jsx";
import { useForm } from "react-hook-form";
// We import useForm from react-hook-form. This is the main hook that helps manage the form state, validation, and submission.
//react-hook-form is a lightweight, and easy-to-use library for managing forms in React.
// It provides optimized form handling with minimal re-renders, built-in validation, and better performance compared to controlled components.
// less re-renders compared to native state validation.
// less code , built in validation
function AddEmployeeForm() {
  const { setDataUpdated } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

  // Initialize useForm hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  // the register function connects input fields to the form management system. It tracks input values, handles validation, and manages form state without requiring you to use useState or useRef.
  // The ...register() function in React Hook Form is a way to connect input fields to the form handler.
  // It returns an object with necessary attributes (ref, onChange, onBlur, etc.), which are then spread (...) onto the input field.

  const handleClick = () => {
    setVisible(true);
  };

  const closeForm = () => {
    setVisible(false);
    reset(); // Reset form fields when closing
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8000/addemployee", data, {
        withCredentials: true,
      });
      console.log(data);
      setVisible(false);
      reset(); // Reset form after submission
      setDataUpdated(true); // Notify parent component about update
    } catch (error) {
      console.log(error);
      const errorMessage = error.response.data.detail;
      console.error("Axios Error:", errorMessage);
      setOpenAlert(true);
      setMessage(errorMessage);
      setTimeout(function () {
        setOpenAlert(false);
      }, 2000);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700"
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

            {/* Form using react-hook-form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter full name"
                  {...register("name", { required: "Full name is required" })}
                  className="border p-2 w-full rounded-md"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  className="border p-2 w-full rounded-md"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="border p-2 w-full rounded-md"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium"
                >
                  Phone Number*
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  className="border p-2 w-full rounded-md"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium">
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter address"
                  {...register("address", { required: "Address is required" })}
                  className="border p-2 w-full rounded-md"
                />
                {errors.address && (
                  <p className="text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium"
                >
                  Department*
                </label>
                <input
                  type="text"
                  id="department"
                  placeholder="Enter department"
                  {...register("department", {
                    required: "Department is required",
                  })}
                  className="border p-2 w-full rounded-md"
                />
                {errors.department && (
                  <p className="text-red-500">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="startingDate"
                  className="block text-sm font-medium"
                >
                  Starting Date*
                </label>
                <input
                  type="date"
                  id="startingDate"
                  {...register("startingDate", {
                    required: "Starting date is required",
                  })}
                  className="border p-2 w-full rounded-md"
                />
                {errors.startingDate && (
                  <p className="text-red-500">{errors.startingDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium">
                  Role*
                </label>
                <select
                  id="role"
                  {...register("role", { required: "Role is required" })}
                  className="border p-2 w-full rounded-md"
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
                {errors.role && (
                  <p className="text-red-500">{errors.role.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Employee
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="bg-gray-300 cursor-pointer px-4 py-2 rounded-md hover:bg-gray-400"
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

import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { AuthContext } from "./AuthProvider.jsx";
function EditForm() {
  const {
    selectedUser,
    setVisible,
    visible,
    setDataUpdated,
    userRole,
    currentUser,
    isEditing,
    setisEditing,
    setSelectedUser,
    API_BASE_URL,
  } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: selectedUser || currentUser, // Set initial values
  });
  // const [formData, setFormData] = useState(selectedUser || currentUser);
  const isEditingOwnProfile = !selectedUser;
  const closeForm = () => {
    if (setisEditing) {
      setisEditing(false);
    }
    if (setVisible) {
      setVisible(false);
    }
    setSelectedUser(null);
  };

  const [emailToUse, setEmailToUse] = useState("");
  // const handleSubmit = async (e) => {
  //   console.log(formData);
  //   e.preventDefault(); // The e.preventDefault() method prevents the default behavior of an event in JavaScript.
  //   //For forms, the default behavior is submitting the form and reloading the page. By using e.preventDefault(), you stop this default submission and allow JavaScript to handle the form data asynchronously.
  //   // try{
  //   //   const response=await axios.put("http://127.0.0.1:8000/dashboard/{email}",{

  //   //   })
  //   // }
  //   // if (props.setisEditing) {
  //   //   props.setisEditing(false);
  //   // }
  //   // if (props.setVisible) {
  //   //   props.setVisible(false);
  //   // }
  // };
  useEffect(() => {
    let email = selectedUser?.email || currentUser?.email;
    setEmailToUse(email); // Update state
  }, [setEmailToUse]);
  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/dashboard/${emailToUse}`,
        data,
        {
          withCredentials: true,
        }
      );
      setDataUpdated(true);
      if (setisEditing) {
        setisEditing(false);
      }
      if (setVisible) {
        setVisible(false);
      }
      setSelectedUser(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update employee";
      console.error("Axios Error:", errorMessage);
    }
  };
  const isDisabled =
    currentUser?.role === "employee" || // Employees cannot change any roles
    isEditingOwnProfile ||
    selectedUser?.role === currentUser?.role; // Admins cannot edit other admins

  return (
    <>
      {(isEditing || visible) && (
        <div className="fixed inset-0 bg-black-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Edit Employee</h1>
              <RxCross1
                className="text-xl cursor-pointer"
                onClick={closeForm}
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "Full name is required" })}
                  name="name"
                  placeholder="Enter full name"
                  className="border p-2 w-full rounded-md disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter email address"
                  className="border p-2 w-full rounded-md  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              {/* <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  {...register("password")}
                  placeholder="Enter password"
                  className="border p-2 w-full rounded-md  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled
                />
              </div> */}
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
                  name="phoneNumber"
                  {...register("phoneNumber", {
                    required: "Phone Number is required",
                    pattern: {
                      value: /^\d{10,}$/,
                      message: "Should be a valid 10 digit number",
                    },
                  })}
                  placeholder="Enter phone number"
                  className="border p-2 w-full rounded-md"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium">
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  {...register("address", {
                    required: "Address is required",
                  })}
                  className="border p-2 w-full rounded-md"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium "
                >
                  Department*
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  placeholder="Enter department"
                  {...register("department", {
                    required: "Department is required",
                  })}
                  className="border p-2 w-full rounded-md  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={userRole === "employee"}
                />
                {errors.department && (
                  <p className="text-red-500 text-sm">
                    {errors.department.message}
                  </p>
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
                  type="text"
                  id="startingDate"
                  name="startingDate"
                  {...register("startingDate", {
                    required: "Starting Date is required",
                  })}
                  className="border p-2 w-full rounded-md  disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled
                />
                {errors.startingDate && (
                  <p className="text-red-500 text-sm">
                    {errors.startingDate.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  {...register("role", {
                    required: "Role is required",
                  })}
                  className="border p-2 w-full rounded-md disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={isDisabled} // Disable selection if userRole is 'employee'
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update
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

export default EditForm;

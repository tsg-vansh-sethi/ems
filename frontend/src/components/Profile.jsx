import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const [currentUser, setCurrentUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const email = decoded.email;
      fetchCurrentUser(email);
    }
  }, [token]);

  const fetchCurrentUser = (email) => {
    fetch(`http://127.0.0.1:8000/user/${email}`, {
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
        setCurrentUser(data);
        setFormData(data);
      })
      .catch((error) => {
        console.error("Error fetching current user details:", error);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/user/${currentUser.email}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setIsEditing(false);
        fetchCurrentUser(currentUser.email);
      })
      .catch((error) => {
        console.error("Error updating user details:", error);
      });
  };

  return (
    <div className="profile mt-2 bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      {!isEditing ? (
        <div className="space-y-2 text-center">
          <p>
            <strong>Name:</strong> {currentUser.name}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {currentUser.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {currentUser.address}
          </p>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;

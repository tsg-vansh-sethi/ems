import { useState, useEffect } from "react";
import axios from "axios";
import EditForm from "./EditForm.jsx";
function Profile(props) {
  const [currentUser, setCurrentUser] = useState({});
  const [isEditing, setisEditing] = useState(false);
  useEffect(() => {
    fetchCurrentUser(props.sendEmail);
  }, []);

  const fetchCurrentUser = async (email) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/user/${email}`, {
        headers: { Authorization: `Bearer ${props.passToken}` },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.log("Axios error:", error.response.data.detail);
    }
    // fetch(`http://127.0.0.1:8000/user/${email}`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       return Promise.reject(`HTTP error! Status: ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setCurrentUser(data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching current user details:", error);
    //   });
  };
  const handleClick = () => {
    setisEditing(true);
  };
  return (
    <>
      <div className="mt-2 bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-bold mb-4">My Profile</h2>
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
            onClick={handleClick}
          >
            Edit Profile
          </button>
        </div>
      </div>
      {isEditing && (
        <EditForm
          user={currentUser}
          role={props.role}
          isEditing={isEditing}
          setisEditing={setisEditing}
          setDataUpdated={props.setDataUpdated}
        />
      )}
    </>
  );
}

export default Profile;

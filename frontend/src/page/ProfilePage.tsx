import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/ProfilePage.css';

const ProfilePage = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    // Ambil ID pengguna yang login dari localStorage
    const userId = localStorage.getItem('userId');  // ID pengguna yang login

    if (userId) {
      // Ambil data pengguna dari API menggunakan ID pengguna
      fetch(`http://localhost:5000/api/user-profile/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUsername(data.username);
          setEmail(data.email);
          setGender(data.gender);
          setProfilePicture(data.profile_picture);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, []);

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>

      {profilePicture && (
        <img
          src={profilePicture}
          alt="Profile"
          className="profile-picture"
        />
      )}

      <div className="profile-details">
        <h2>Username: {username}</h2>
        <p>Email: {email}</p>
        <p>Gender: {gender}</p>
      </div>

      <Link to="/editprofile" className="edit-profile-link">
        Edit Profile
      </Link>
    </div>
  );
};

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userID, setUserID] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <h2>Username: {username}</h2>
        <p>Email: {email}</p>
        <p>Gender: {gender}</p>
        {profilePicture && <img src={profilePicture} alt="Profile" />}
      </div>
      <Link to="/editprofile">Edit Profile</Link>
    </div>
  );
};

export default ProfilePage;
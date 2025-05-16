import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/EditProfilePage.css';

const EditProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.id;

      fetch(`http://localhost:3000/api/user-profile/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUsername(data.username);
          setEmail(data.email);
          setGender(data.gender);
          setProfilePicture(data.profile_picture || '');
        })
        .catch((err) => {
          console.error('Error loading user profile:', err);
        });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);
    const userId = user.id;

    try {
      const response = await fetch(`http://localhost:3000/api/user-profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          gender,
          profile_picture: profilePicture,
        }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        navigate('/profile');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>Username:</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Pilih gender</option>
          <option value="Male">Laki-laki</option>
          <option value="Female">Perempuan</option>
          <option value="Other">Lainnya</option>
        </select>

        <label>Profile Picture (URL):</label>
        <input type="text" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />

        {profilePicture && <img src={profilePicture} alt="Preview" className="preview-image" />}

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
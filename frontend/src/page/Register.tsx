import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React, { useState } from "react";
import "../style/Register.css";
import { Link } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    gender: "",
    profileImage: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, profileImage: files?.[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();

    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("username", formData.username);
    form.append("gender", formData.gender);
    if (formData.profileImage) {
      form.append("profileImage", formData.profileImage);
    }


    fetch("/register", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // Do not set Content-Type for FormData
        'authorization': 'Bearer ' + localStorage.getItem('token'), // Optional: Include token if needed
      },
      
      body: form,
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Register failed");
        }
        return res.json();
      })
      .then((data) => {
        alert("Registration successful");
      })
      .catch((err) => {
        console.error("Error detail:", err);
        alert("Registration failed: " + err.message);
      });
    
  };

  return (
    <div className='body'>
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required onChange={handleChange} />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required onChange={handleChange} />

          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" required onChange={handleChange} />

          <label>Gender</label>
          <div className="gender-options">
            <label>
              <input type="radio" name="gender" value="male" required onChange={handleChange} /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" required onChange={handleChange} /> Female
            </label>
          </div>
          <label htmlFor="profileImage">Profile Image</label>
          <input type="file" name="profileImage" id="profileImage" accept="image/*" onChange={handleChange} />
          <Link to="/login">
            <button type="submit">Register</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;

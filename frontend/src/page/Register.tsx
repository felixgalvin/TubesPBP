import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/Api';
import "../style/Register.css";

const RegisterForm: React.FC = () => {
  
  const navigate = useNavigate();
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("username", formData.username);
    form.append("gender", formData.gender);

    if (formData.profileImage) {
      form.append("profileImage", formData.profileImage);
    }

    try {
      await api.postFormData<null>('/register', form, false);

      alert("Registration successful");
      navigate("/auth/login"); // Redirect to login page after successful registration
    } catch (err: any) {
      console.error("Error detail:", err);
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <section className="register-page theme-page">
      <div className="register-container theme-form">
        <h2 className="register-title theme-text-center">Create Account</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="register-form">
          <div className="register-input-group theme-input-group">
            <label htmlFor="email" className="register-label theme-label">Email</label>
            <input type="email" name="email" id="email" className="register-input theme-input" required onChange={handleChange}/>
          </div>

          <div className="register-input-group theme-input-group">
            <label htmlFor="password" className="register-label theme-label">Password</label>
            <input type="password" name="password" id="password" className="register-input theme-input" required onChange={handleChange}/>
          </div>

          <div className="register-input-group theme-input-group">
            <label htmlFor="username" className="register-label theme-label">Username</label>
            <input type="text" name="username" id="username" className="register-input theme-input" required onChange={handleChange}/>
          </div>

          <div className="register-input-group theme-input-group">
            <label className="register-label theme-label">Gender</label>
            <div className="register-gender-options">
              <label className="register-radio-label">
                <input type="radio" name="gender" value="MALE" required onChange={handleChange} className="register-radio"/>
                <span>Male</span>
              </label>
              <label className="register-radio-label">
                <input type="radio" name="gender" value="FEMALE" required onChange={handleChange} className="register-radio"/>
                <span>Female</span>
              </label>
            </div>
          </div>

          <div className="register-input-group theme-input-group">
            <label htmlFor="profileImage" className="register-label theme-label">Profile Image</label>
            <input type="file" name="profileImage" id="profileImage" accept="image/*" onChange={handleChange} className="register-file-input"/>
          </div>

          <div className="register-buttons">
            <button type="submit" className="register-submit-btn theme-btn theme-btn-success">Register</button>
            <Link to="/auth/login" className="register-login-link">
              <button type="button" className="register-login-btn theme-btn theme-btn-secondary">Back to Login</button>
            </Link>
          </div>
        </form>

      </div>
    </section>
  );
};

export default RegisterForm;

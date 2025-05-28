import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/Api';
import "../style/PostPage.css";

const PostPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    user_Id: localStorage.getItem("userId") || "",
    title: "",
    post: "",
    topik: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formPayload = {
      user_Id: formData.user_Id,
      title: formData.title,
      post: formData.post,
      topik: formData.topik,
      like: 0,
    };
    try {
      await api.post('/user/post', formPayload, true);
      alert("Post Created successfully");
      navigate("/user");
    } catch (error: any) {
      console.error("Error detail:", error);
      alert("Post failed: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <section className="post-page theme-page">
      <div className="post-form-container theme-form">
        <h2 className="post-title theme-text-center">Create New Post</h2>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="post-input-group theme-input-group">
            <label htmlFor="title" className="post-label theme-label">Title</label>
            <input type="text" name="title" id="title" required onChange={handleChange} className="post-input theme-input" placeholder="Enter a catchy title" />
          </div>
          <div className="post-input-group theme-input-group">
            <label htmlFor="postContent" className="post-label theme-label">Content</label>
            <textarea name="post" id="postContent" required onChange={handleChange} className="post-textarea theme-input" placeholder="Share your thoughts here..." rows={5}></textarea>
          </div>
          <div className="post-input-group1 theme-input-group">
            <label htmlFor="topik" className="post-label theme-label">Topic</label>
            <select name="topik" id="topik" required onChange={handleChange} className="post-select theme-input" value={formData.topik}>
              <option value="" disabled hidden>-- Select Topic --</option>
              <option value="Sports">Sports</option>
              <option value="Game">Game</option>
              <option value="Music">Music</option>
              <option value="Otomotif">Otomotif</option>
              <option value="War">War</option>
              <option value="Daily Life">Daily Life</option>
            </select>
          </div>
          <div className="post-buttons">
            <button type="submit" className="post-submit-btn theme-btn theme-btn-success">Create Post</button>
            <Link to="/user" className="post-cancel-link">
              <button type="button" className="post-cancel-btn theme-btn theme-btn-secondary">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PostPage;

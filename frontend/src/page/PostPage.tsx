import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../style/PostPage.css";

const PostPage: React.FC = () => {
  const [formData, setFormData] = useState({
    user_Id: localStorage.getItem("userId") || "",  // Getting userId from localStorage
    title: "",
    post: "",  // Renaming 'postContent' to 'post'
    topik: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // No need for FormData here. Just use a plain object to send JSON
    const formPayload = {
      user_id: formData.user_Id,
      title: formData.title,
      post: formData.post,  // Renaming 'postContent' back to 'post'
      topik: formData.topik,
      like: 0,
    };

    const fetchUserData = async (token: string, formData: any) => {
      try {
        const response = await fetch("/api/user/post", {
          method: "POST",
          body: JSON.stringify(formData),  // Send formData as JSON
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Post creation failed");
        }

        const data = await response.json();
        alert("Post Created successfully");
        navigate("/user");
      } catch (error) {
        console.error("Error detail:", error);
        alert("Post failed: " + (error instanceof Error ? error.message : String(error)));
      }
    };

    const token = localStorage.getItem('token') || '';
    if (token) {
      fetchUserData(token, formPayload);  // Passing the plain object formPayload
    } else {
      alert("No token found. Please log in first.");
    }
  };

  return (
    <section className="body-post">
      <div className="form-container">
        <h2>CREATE POST</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            onChange={handleChange}
          />

          <label htmlFor="postContent">Content</label>
          <input
            type="text"
            name="post"
            id="postContent"
            required
            onChange={handleChange}
          />

          <label htmlFor="topik">Genre</label>
          <div className="gender-options">
            <select
              name="topik"
              id="topik"
              onChange={handleChange}
              required
              value={formData.topik} // make it controlled
            >
              <option value="" disabled hidden>-- Select Genre --</option>
              <option value="Sports">Sports</option>
              <option value="Game">Game</option>
              <option value="Music">Music</option>
              <option value="Otomotif">Otomotif</option>
              <option value="War">War</option>
              <option value="Daily Life">Daily Life</option>
            </select>
          </div>


          <button type="submit" className="button-primary">Post</button>
          <Link to="/user">
            <button type="button" className="button-cancel">Cancel</button>
          </Link>
        </form>
      </div>
    </section>
  );
};

export default PostPage;

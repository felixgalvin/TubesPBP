import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../style/PostPage.css";

const PostPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    post: "",
    topik: "",
  });

  // Inisialisasi navigate di luar handleSubmit
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    
    form.append("title", formData.title);
    form.append("post", formData.post);
    form.append("topik", formData.topik);

    fetch("/api/post", {
      method: "POST",
      body: form,
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Post create failed");
        }
        return res.json();
      })
      .then((data) => {
        alert("Post Created successful");
        navigate("/user"); 
      })
      .catch((err) => {
        console.error("Error detail:", err);
        alert("Post failed: " + err.message);
      });
  };

  return (
    <section className="bodyPost">

    <div className="form-container">
      <h2>CREATE POST</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="title">Title</label>
        <input type="title" name="title" id="title" required onChange={handleChange} />

        <label htmlFor="desc">Content</label>
        <input type="desc" name="desc" id="desc" required onChange={handleChange} />

        <label>Genre</label>
        <div className="gender-options">
          <label>
            <input type="radio" name="topik" value="Sports" required onChange={handleChange} /> Sports
          </label>
          <label>
            <input type="radio" name="topik" value="Game" required onChange={handleChange} /> Game
          </label>
          <label>
            <input type="radio" name="topik" value="Food" required onChange={handleChange} /> Food
          </label>
          <label>
            <input type="radio" name="topik" value="Music" required onChange={handleChange} /> Music
          </label>
          <label>
            <input type="radio" name="topik" value="Otomotif" required onChange={handleChange} /> Otomotif
          </label>
          <label>
            <input type="radio" name="topik" value="War" required onChange={handleChange} /> War
          </label>
          <label>
            <input type="radio" name="topik" value="Daily Life" required onChange={handleChange} /> Daily Life
          </label>
        </div>

        <button type="submit" className="button1">Post</button>
        <Link to="/user">
          <button className="button3">Cancel</button>
        </Link>
      </form>
    </div>
    </section>
  );
};

export default PostPage;

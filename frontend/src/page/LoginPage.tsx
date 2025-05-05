import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/LoginPage.css';

export const login = async (email: string, password: string) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login gagal");
  }

  const data = await response.json();
  return data; // { token: "..." }
};

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(formData.email, formData.password);
      localStorage.setItem("token", data.token);
      if (!data.user) {
        navigate("/homeLogin");
        alert("Login berhasil!");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      alert("Login gagal: " + err.message);
    }
  };  

  return (
    <div className="body">
      <div className="login-container">
        <h2>Reddit Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="button">Login</button>
          <Link to="/register">
            <button className="button5">Register</button>
          </Link>
          <Link to="/home">
            <button className="button6">Home here</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/Api';
import '../style/LoginPage.css';

// Fungsi login ke backend
const login = (email: string, password: string) =>
  api.post<{ token: string }>('/login', { email, password }, false);

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuest = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(formData.email, formData.password);
      localStorage.setItem("token", data.token);
      navigate("/user");
      alert("Login berhasil!");
    } catch (err: any) {
      console.error("Login error:", err);
      alert("Login gagal: " + err.message);
    }
  };
  return (
    <div className="login-page theme-page">
      <div className="login-container theme-form">
        <h2 className="login-title theme-text-center">Reddit Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-input-group theme-input-group">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              className="login-input theme-input"
              required
              onChange={handleChange}
              value={formData.email}
            />
          </div>
          <div className="login-input-group theme-input-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="login-input theme-input"
              required
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <button type="submit" className="login-button theme-btn theme-btn-success">Login</button>
          <div className="login-actions theme-flex-row">
            <Link to="/auth/register" className="login-register-link">
              <button type="button" className="login-register-btn theme-btn theme-btn-secondary">Register</button>
            </Link>
            <button 
              type="button" 
              className="login-guest-btn theme-btn theme-btn-secondary" 
              onClick={handleGuest}
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import profileImage from '../assets/profileImage.jpeg';

type User = {
  username: string;
  profileImage: string;
};

const UserLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      setError('Error fetching user data');
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <section className="bodyHome">
        <main className="posts">
          <Outlet /> {/* DI SINI HALAMAN CHILD AKAN DITAMPILKAN */}
        </main>
    </section>
  );
};

export default UserLayout;

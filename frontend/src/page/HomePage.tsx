import { useState, useEffect } from 'react';
import '../style/HomePage.css';
import { Link, useNavigate } from 'react-router-dom';
import profileImage from '../assets/profileImage.jpeg';

type User = {
  user_id: string;
  email: string;
  username: string;
  gender: string;
  profileImage: string;
  createdAt: string;
};

type Post = {
  post_id: string;
  title: string;
  post: string;
  like: number;
  topik: string;
};

type PostProps = Post & {
  onLike: (postId: string) => void;
};

const Postdesk = ({ post_id, title, post, like, topik, onLike }: PostProps) => {
  const navigate = useNavigate();

  const handleCommentClick = () => {
    navigate(`/user/post/${post_id}/comment`);
  };

  return (
    <div className="post">
      <h2>{title}</h2>
      <p>{post}</p>
      <span className="topic">{topik}</span>
      <div className="actions">
        <button
          className="buttonHome"
          onClick={() => onLike(post_id)}
          disabled={!localStorage.getItem("token")}
          style={{
            opacity: !localStorage.getItem("token") ? 0.5 : 1,
            cursor: !localStorage.getItem("token") ? "not-allowed" : "pointer",
          }}
        >
          ❤️ {like}
        </button>
        <button className="buttonHome" onClick={handleCommentClick}>💬</button>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTopik, setSelectedTopik] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth');
  };

  const handleTopikClick = (topik: string) => {
    setSelectedTopik(prev => (prev === topik ? null : topik));
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/post/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const data = await response.json();

      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.post_id === postId ? { ...p, like: data.like } : p
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUserData(token);
    fetchPosts();
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
      localStorage.setItem('userId', data.data.user_id);
    } catch (error) {
      setError('Error fetching user data');
      console.error('Error:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError('Error fetching posts');
      console.error('Error fetching posts:', error);
    }
  };

  const topiks = ["Sports", "Game", "Music", "Otomotif", "War", "Daily Life"];

  return (
    <section className="bodyHome">
      <div className="nav-container">
        {user && (
          <Link to="post">
            <button className="buttonPOST">Create Post</button>
          </Link>
        )}

        <div className="navbar">
          <div className="username">
            {user ? (
              <>
                <span>{user.username}</span>
                <Link to="profile">
                  <img
                    src={user.profileImage
                      ? `http://localhost:3000/uploads/${user.profileImage}`
                      : profileImage}
                    alt="Profile"
                    className="user-profile-image"
                    style={{ cursor: 'pointer' }}
                  />
                </Link>
                <button className="button2" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <span>Guest</span>
                <img src={profileImage} alt="Guest Profile" className="user-profile-image" />
                <Link to="/auth/login">
                  <button className="button2">Login Here</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <aside className="sidebar">
          <button className="popular-btn">Popular</button>
          <div className="topics">
            <h3>Topic:</h3>
            <ul>
              {topiks.map((topik, idx) => (
                <li
                  key={idx}
                  onClick={() => handleTopikClick(topik)}
                  className={selectedTopik === topik ? "selected" : ""}
                >
                  {topik}
                </li>
              ))}
              <li onClick={() => setSelectedTopik(null)}>Show All</li>
            </ul>
          </div>
        </aside>

        <main className="posts">
          {posts.length > 0 ? (
            posts
              .filter(p => !selectedTopik || p.topik === selectedTopik)
              .map(post => (
                <Postdesk
                  key={post.post_id}
                  {...post}
                  onLike={handleLike}
                />
              ))
          ) : (
            <p>No posts available</p>
          )}
        </main>
      </div>
    </section>
  );
};

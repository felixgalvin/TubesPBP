import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/HomePage.css";
import { api } from '../api/Api';
import { formatTime } from "../utils/FormatTime"; // Assuming you have a utility function for formatting time
import { User, Post, Like, PostdeskProps } from "../types/Index"; // Assuming you have defined types for User, Post, and PostdeskProps
import { getProfileImageUrl } from '../utils/ProfileImage';

const Postdesk = ({
  post_Id, title, post, likePost, topik, createdAt, username, profileImage, isLiked, onLike
}: PostdeskProps) => {
  const navigate = useNavigate();
  const handleCommentClick = () => navigate(`/post/${post_Id}/comment`);
  
  return (
    <div className="home-post">
      <div className="home-post-header">
        <img src={getProfileImageUrl(profileImage)} alt={username || "User"} className="home-post-avatar" />
        <div className="home-post-meta">
          <h3 className="home-post-title">{title}</h3>
          <div className="home-post-info">
            <span className="home-post-username">{username || "Unknown User"}</span>
            <span className="home-post-time">{formatTime(createdAt)}</span>
            <span className="home-post-topic">{topik}</span>
          </div>
        </div>
      </div>
      <div className="home-post-content"><p>{post}</p></div>
      <div className="home-post-actions">
        <button className={`home-post-like-btn ${isLiked ? 'home-post-like-active' : ''}`} onClick={() => onLike(post_Id)} disabled={!localStorage.getItem("token")}
          style={{ opacity: !localStorage.getItem("token") ? 0.5 : 1, cursor: !localStorage.getItem("token") ? "not-allowed" : "pointer" }}>
          {isLiked ? "❤️" : "🤍"} {likePost}
        </button>
        <button className="home-post-comment-btn theme-btn theme-btn-secondary" onClick={handleCommentClick}>💬</button>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [mode, setMode] = useState<'recent' | 'popular' | 'topic'>('recent');
  const [selectedTopik, setSelectedTopik] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const navigate = useNavigate();
  const topiks: string[] = ["Sports", "Game", "Music", "Otomotif", "War", "Daily Life"];
  const limit = 10;

  const token = localStorage.getItem("token");

  const handleUnauthorized = () => {
    localStorage.removeItem("token"); 
    setUser(null);
    setLikedPosts([]);
  };

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    }
  }, [token]);

  useEffect(() => {
    setOffset(0);
    setPosts([]);
    setTotalPosts(0);
  }, [mode, selectedTopik]);

  useEffect(() => {
    fetchPosts();
  }, [offset, mode, selectedTopik]);

  const fetchPosts = async () => {
    try {
      let endpoint = `/user/post?limit=${limit}&offset=${offset}`;
      if (mode === 'popular') {
        endpoint = `/user/post/popular?limit=${limit}&offset=${offset}`;
      } else if (mode === 'topic' && selectedTopik) {
        endpoint = `/user/post/topic?topik=${encodeURIComponent(selectedTopik)}&limit=${limit}&offset=${offset}`;
      }
      // Gunakan api.get. Argumen kedua disesuaikan apakah token diperlukan (true/false)
      const result = await api.get<{ data: any; total?: number }>(endpoint, false);
      const batch: Post[] = Array.isArray(result.data) ? result.data : [];
      const total: number = typeof result.total === 'number' ? result.total : batch.length;
      setPosts((prev) => (offset === 0 ? batch : [...prev, ...batch]));
      setTotalPosts(total);
    } catch (error) {
      setError('Error fetching posts');
    }
  };

  const loadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("likedPosts");
    setUser(null);
    window.location.href = "/";
  };

  const handlePopularClick = () => {
    setMode('popular');
    setSelectedTopik(null);
  };
  
  const handleRecentClick = () => {
    setMode('recent');
    setSelectedTopik(null);
  };
  
  const handleTopikClick = (topik: string) => {
    setMode('topic');
    setSelectedTopik(topik);
  };

  const handleLike = async (postId: string) => {
    if (!token) return;
    try {
      const { likePost } = await api.post<{ likePost: number }>(`/user/post/${postId}/like`, {}, true);
      setPosts(prev => prev.map(p => p.post_Id === postId ? { ...p, likePost } : p));
      const updated = likedPosts.includes(postId)
        ? likedPosts.filter(id => id !== postId)
        : [...likedPosts, postId];
      localStorage.setItem('likedPosts', JSON.stringify(updated));
      setLikedPosts(updated);
    } catch (error) {
      console.error('Error updating like:', error);
      alert('you not login');
    }
  };
  

  const fetchUserData = async (token: string) => {
    try {
      const { data } = await api.get<{ data: any }>('/user', true);
      setUser(data);
      setLikedPosts(data.likedPosts ?? []);
      localStorage.setItem('userId', data.user_Id);
      localStorage.setItem('likedPosts', JSON.stringify(data.likedPosts ?? []));
    } catch (err: any) {
      if (err.message.includes('401')) handleUnauthorized();
      else {
        setError('Error fetching user data');
        console.error(err);
      }
    }
  };

  if (error) {
    return (
      <section className="home-page">
        <div className="home-error-message">{error}</div>
      </section>
    );
  }

  const displayedPosts = posts;
  const hasMore = offset < totalPosts;

  return (
    <section className="home-page">
      <header className="home-header">
        <div className="home-create-post">
          {user && (
            <Link to="post">
              <button className="home-create-btn theme-btn">Create Post</button>
            </Link>
          )}
        </div>
        
        <div className="home-user-section">
          {user ? (
            <>
              <span className="home-username">{user.username}</span>
              <Link to="profile">
                <img src={getProfileImageUrl(user.profileImage)} alt="Profile" className="home-avatar" />
              </Link>
              <button className="home-auth-btn theme-btn theme-btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="home-username">Guest</span>
              <img src={getProfileImageUrl()} alt="Guest Profile" className="home-avatar"/>
              <Link to="/auth/login">
                <button className="home-auth-btn theme-btn theme-btn-secondary">Login</button>
              </Link>
              {/* <button className="home-auth-btn theme-btn theme-btn-secondary" onClick={handleLogout}>Bug Logout</button> */}
            </>
          )}
        </div>
      </header>
      <div className="home-content">
        <aside className="home-sidebar">
          <button 
            className={`home-popular-btn theme-btn${mode === 'popular' ? ' active' : ''}`}
            onClick={mode === 'popular' ? handleRecentClick : handlePopularClick}
          >
            {mode === 'popular' ? 'Show Recent' : 'Popular'}
          </button>
          <div className="home-topics">
            <h3 className="home-topics-title">Topics</h3>
            <ul className="home-topics-list">
              {topiks.map((topik, idx) => (
                <li
                  key={idx}
                  className={`home-topic-item ${selectedTopik === topik && mode === 'topic' ? 'selected' : ''}`}
                  onClick={() => handleTopikClick(topik)}
                >
                  {topik}
                </li>
              ))}
              <li className="home-topic-item" onClick={handleRecentClick}> Show All Topics </li>
            </ul>
          </div>
        </aside>

        <main className="home-main">
          <div className="home-post-list">
            {displayedPosts.map((post) => (
              <Postdesk
                key={post.post_Id}
                {...post}
                onLike={handleLike}
                isLiked={likedPosts.includes(post.post_Id)}
              />
            ))}
          </div>
          {hasMore && (
            <div className="home-load-more-container">
              <button onClick={loadMore} className="theme-btn home-load-more-btn"> Load More Posts </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

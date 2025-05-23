import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/HomePage.css";
import defaultProfileImage from "../assets/profileImage.jpeg";
import { API_BASE_URL } from "../api/Api";
import { formatTime } from "../utils/FormatTime"; // Assuming you have a utility function for formatting time
import { User, Post, Like, PostdeskProps } from "../types/Index"; // Assuming you have defined types for User, Post, and PostdeskProps

const Postdesk = ({
  post_Id,
  title,
  post,
  likePost,
  topik,
  createdAt,
  username,
  profileImage,
  isLiked,
  onLike,
}: PostdeskProps) => {
  const navigate = useNavigate();
  const handleCommentClick = () => navigate(`/post/${post_Id}/comment`);

  return (
    <div className="home-post">
      <div className="home-post-header">
        <img
          src={
            profileImage
              ? `http://localhost:3000/uploads/${profileImage}`
              : defaultProfileImage
          }
          alt={username || "User"}
          className="home-post-avatar"
        />
        <div className="home-post-meta">
          <h3 className="home-post-title">{title}</h3>
          <div className="home-post-info">
            <span className="home-post-username">{username || "Unknown User"}</span>
            <span className="home-post-time">{formatTime(createdAt)}</span>
            <span className="home-post-topic">{topik}</span>
          </div>
        </div>
      </div>
      
      <div className="home-post-content">
        <p>{post}</p>
      </div>
      
      <div className="home-post-actions">
        <button
          className={`home-post-like-btn ${isLiked ? 'home-post-like-active' : ''}`}
          onClick={() => onLike(post_Id)}
          disabled={!localStorage.getItem("token")}
          style={{
            opacity: !localStorage.getItem("token") ? 0.5 : 1,
            cursor: !localStorage.getItem("token") ? "not-allowed" : "pointer",
          }}
        >
          {isLiked ? "❤️" : "🤍"} {likePost}
        </button>
        <button
          className="home-post-comment-btn theme-btn theme-btn-secondary"
          onClick={handleCommentClick}
        >
          💬
        </button>
      </div>
    </div>
  );
};

export const HomePage = () => {
  // const didFetchPostsRef = useRef(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [mode, setMode] = useState<'recent' | 'popular' | 'topic'>('recent');
  const [selectedTopik, setSelectedTopik] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const topiks: string[] = ["Sports", "Game", "Music", "Otomotif", "War", "Daily Life"];

  // get current token
  const token = localStorage.getItem("token");

  // handle unauthorized responses
  const handleUnauthorized = () => {
    localStorage.removeItem("token"); 
    setUser(null);
    setLikedPosts([]);
  };

  // fetch first page once (guarded for StrictMode)
  // useEffect(() => {
  //   if (didFetchPostsRef.current) return;
  //   didFetchPostsRef.current = true;
  //   fetchPosts();
  // }, []);

  // fetch user data when token changes
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
      let endpoint = `${API_BASE_URL}/user/post?limit=${limit}&offset=${offset}`;
      if (mode === 'popular') {
        endpoint = `${API_BASE_URL}/user/post/popular?limit=${limit}&offset=${offset}`;
      } else if (mode === 'topic' && selectedTopik) {
        endpoint = `${API_BASE_URL}/user/post/topic?topik=${encodeURIComponent(selectedTopik)}&limit=${limit}&offset=${offset}`;
      }
      const res = await fetch(endpoint);
      if (!res.ok) {
        setPosts([]);
        return;
      }
      const result = await res.json();
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

  const navigate = useNavigate();

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
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/user/post/${postId}/like`,
        {
          method: "POST",
          headers:
           {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const data = await response.json();

      setPosts((prev) =>
        prev.map((p) =>
          p.post_Id === postId ? { ...p, likePost: data.likePost } : p
        )
      );

      setLikedPosts((prev) => {
        const updated = prev.includes(postId)
          ? prev.filter((id) => id !== postId)
          : [...prev, postId];
        localStorage.setItem("likedPosts", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Error updating like:", error);
      alert("you not login");
    }
  };
  

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUser(data.data);
      setLikedPosts(data.data.likedPosts ?? []);
      localStorage.setItem("userId", data.data.user_Id);
      localStorage.setItem("likedPosts", JSON.stringify(data.data.likedPosts ?? []));
    } catch (err) {
      setError("Error fetching user data");
      console.error(err);
    }
  };

  // tampilkan error di UI jika error
  if (error) {
    return (
      <section className="home-page">
        <div className="home-error-message">{error}</div>
      </section>
    );
  }

  // derive filtered and paginated posts
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
                <img
                  src={
                    user.profileImage
                      ? `http://localhost:3000/uploads/${user.profileImage}`
                      : defaultProfileImage
                  }
                  alt="Profile"
                  className="home-avatar"
                />
              </Link>
              <button className="home-auth-btn theme-btn theme-btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="home-username">Guest</span>
              <img
                src={defaultProfileImage}
                alt="Guest Profile"
                className="home-avatar"
              />
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
              <li 
                className="home-topic-item" 
                onClick={handleRecentClick}
              >
                Show All Topics
              </li>
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
              <button onClick={loadMore} className="theme-btn home-load-more-btn">
                Load More Posts
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

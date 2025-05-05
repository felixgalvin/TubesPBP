import { useState, useEffect } from 'react'
import reactLogo from '../assets/joko.svg'
import '../style/HomePage.css'
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import profileImage from '../assets/profileImage.jpeg'

type Post = {
  title: string,
  content: string,
  like: number,
}

type User = {
  username: string;
  profileImage: string;
}
 
export const Postdesk = ({ title, content, like }: Post) => {
  return (
    <div className="post">
      <h2>{title}</h2>
      <p>{content}</p>
      <div className="actions">
        ❤️ {like} &nbsp; 💬
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  const post: Post[] = [
    {
      title:"NBA 2025",
      content:"Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"BUCINLUCOK",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"YESIRRR",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"CRYPTO BOSS COMINGGG",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"PAJERO",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"NBSA 2025",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"SIJDHUhhdhhdhd 5",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"NBSA 2025",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"ITHB CORE",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"Nuijsd",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },

  ];

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
      console.log('User data:', data);

      // Set the correct part of the response
      setUser(data.data); // Set user data as the 'data' part of the response
    } catch (error) {
      setError('Error fetching user data');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="username">
          {user ? (
            <>
              <span>{user.username}</span>
              <img
                src={user.profileImage
                  ? `http://localhost:3000/uploads/${user.profileImage}`
                  : profileImage}
                alt="Profile"
                className="user-profile-image"
              />
              <button className="button2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <span>Guest</span>
              <img src={profileImage} alt="Guest Profile" className="user-profile-image" />
              <Link to="/login">
                <button className="button2">Login Here</button>
              </Link>
            </>
          )}
        </div>
      </div>


      <div className="container">
        <aside className="sidebar">
          <button className="popular-btn">Popular</button>
          <div className="topics">
            <h3>Topik:</h3>
            <ul>
              <li>Sports</li>
              <li>Game</li>
              <li>Food</li>
              <li>Otomotif</li>
            </ul>
          </div>
        </aside>

        <main className='posts'>
          {post.map((item, index) => (
            <Postdesk key={index} title={item.title} content={item.content} like={item.like} />
          ))}
        </main>
      </div>
    </>
  );
}
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}


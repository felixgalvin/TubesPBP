import { useState } from 'react'
import reactLogo from '../assets/joko.svg'
import '../style/HomePage.css'
import { FaUserCircle } from "react-icons/fa";

type Post = {
  title:string,
  content:string,
  like:number,
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
  const post:Post[] = [
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
      title:"NBS`A 2025",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"SIJDHUhhdhhdhd 5",
      content:"boston jelek Calvin jelek hehehehehehhehe hehehehhehehehehehe hheehehehehhecoco hehehehe hehehe ehhheheh hehehhe ehehe hehe",
      like:12
    },
    {
      title:"NBS`A 2025",
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
  ]

  const handleSubmit = (e: React.FormEvent) => {
      // e.preventDefault();
      // const form = new FormData();
  
      // form.append("email", formData.email);
      // form.append("password", formData.password);
      // form.append("username", formData.username);
      // form.append("gender", formData.gender);
      // if (formData.profileImage) {
      //   form.append("profileImage", formData.profileImage);
      // }
  
  
      // fetch("/register", {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json', // Do not set Content-Type for FormData
      //     'authorization': 'Bearer ' + localStorage.getItem('token'), // Optional: Include token if needed
      //   },
        
      //   body: form,
      // })
      //   .then(async (res) => {
      //     if (!res.ok) {
      //       const error = await res.json();
      //       throw new Error(error.message || "Register failed");
      //     }
      //     return res.json();
      //   })
      //   .then((data) => {
      //     alert("Registration successful");
      //   })
      //   .catch((err) => {
      //     console.error("Error detail:", err);
      //     alert("Registration failed: " + err.message);
      //   });
    };

  return (
    <>  
  <div className='nav-container'>
  <div className="navbar">
    <div className="username">
      <span>Username</span>
      <FaUserCircle className='user-icon'/>
    </div>
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
        <Postdesk title={item.title} content={item.content} like={item.like} />
      ))}
    </main>
  </div>

  {/* <div>
    <p className='hidden'>
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    </p>
  </div> */}
    </>
  )
}

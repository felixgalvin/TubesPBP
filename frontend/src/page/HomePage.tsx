import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '../assets/vite.svg'
import '../style/HomePage.css'

function HomePage() {
  return (
    <>  
  <section className='nav-container'>
  <div className="navbar">
    <div className="username">
      <span>Username</span>
      <img src={viteLogo} alt="User Icon" className="user-icon" />
    </div>
  </div>
  </section>

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

    <main className="posts">
      <div className="post">
        <h2>NBA 2025</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a felis nec sapien...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>
      <div className="post">
        <h2>NBA 2025</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a felis nec sapien...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>
      <div className="post">
        <h2>NBA 2025</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a felis nec sapien...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>
      <div className="post">
        <h2>NBA 2025</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a felis nec sapien...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>
      <div className="post">
        <h2>NBA 2025</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a felis nec sapien...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>
      <div className="post">
        <h2>NBA 2025</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a felis nec sapien...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>
      <div className="post">
        <h2>NBA 2025</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a felis nec sapien...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>
      <div className="post">
        <h2>NBA 2025</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a felis nec sapien...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>

      <div className="post">
        <h2>Master Chef 2028</h2>
        <p>Praesent tincidunt, sapien sed convallis egestas, ex augue feugiat metus...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>

      <div className="post">
        <h2>Pajero 2030</h2>
        <p>Mobil masa depan dengan teknologi AI terintegrasi, desain sporty, dan hemat energi...</p>
        <div className="actions">
          ❤️ 0 &nbsp; 💬 0
        </div>
      </div>
    </main>
  </div>

  <div>
    <p className='hidden'>
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    </p>
  </div>
  {/* <footer>
    <div className="footer-left">
      © 2025 YourWebsite. All rights reserved.
    </div>
    <div className="footer-right">
      <a href="#">About</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
    </div>
  </footer> */}

    </>
  )
}

export default HomePage

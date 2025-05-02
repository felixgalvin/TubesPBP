import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../style/LoginPage.css'
import { Link } from 'react-router-dom';

export const LoginPage = () =>{
  return (
    <div className='body'>
        <div className="login-container">
            <h2>Reddit Login</h2>
            <form action="#" method="POST">
                <div className="input-group">
                    <input type="text" id="email" placeholder="Email" name="email" required />
                </div>
                <div className="input-group">
                    <input type="password" id="password" placeholder="Password" name="password" required />
                </div>
                <Link to="/home">
                    <button className='button'>Login</button>
                </Link>
                <Link to="/register">
                    <button className='button2'>Register here</button>
                </Link>
            </form>
        </div>
    </div>
  )
}

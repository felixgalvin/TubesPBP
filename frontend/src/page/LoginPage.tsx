import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../style/LoginPage.css'

function LoginPage() {
  return (
    <>  
    <div className="login-container">
        <h2>Login</h2>
        <form action="#" method="POST">
            <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" className="btn-login">Masuk</button>
        </form>
    </div>
    </>
  )
}

export default LoginPage

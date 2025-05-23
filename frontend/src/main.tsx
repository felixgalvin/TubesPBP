import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Router }  from './routes/Route'
// import { HomePage } from './page/HomePage'
// import { LoginPage } from './page/LoginPage'
import ReactDOM from "react-dom/client";
import React from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <StrictMode>
      <App />
  //</StrictMode>);

);
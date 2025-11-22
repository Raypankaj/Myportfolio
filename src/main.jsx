// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// ⬇️ CHANGE 1: Import HashRouter instead of BrowserRouter
import { HashRouter } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ⬇️ CHANGE 2: Wrap App with HashRouter */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
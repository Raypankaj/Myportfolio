import React from 'react';
// Import the essential components for routing
import { Routes, Route } from 'react-router-dom';


import './App.css'; // Global styles

// Component Imports
import Navbar from './components/Layout/navigation';
import Home from './components/pages/home/home';
import Footer from './components/Layout/fotter';
import About from './components/pages/About/About';
import Contact from './components/pages/contact/contact';
import Skill from './components/pages/Skill/Skill';
import AIAnswerComponent from './components/pages/AIAnswerComponent/AIAnswerComponent';
import Projects from './components/pages/projects/project'; // Using component name Projects

function App() {
  return (
    <div className="App">

      {/* Navbar and Footer are OUTSIDE the Routes, so they appear on ALL pages */}
      <Navbar />

      <main>
        {/* The Routes component listens to the URL and renders the matching Route */}
        <Routes>

          {/* 1. Home Page */}
          <Route path="/" element={<Home />} />

          {/* 2. About Page */}
          <Route path="/about" element={<About />} />

          {/* 3. Skills Page - Corrected path case to match link in Navbar.jsx */}
          <Route path="/skill" element={<Skill />} />

          {/* 4. Projects Page - CORRECTED: Mapped Projects component to its own logical path */}
          <Route path="/projects" element={<Projects />} />

          {/* 5. Contact Page - CORRECTED: Mapped Contact component to its own logical path */}
          <Route path="/contact" element={<Contact />} />

          {/* Optional: Add a 404/Not Found Route */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
          {/* ... other routes ... */}
          <Route path="/ai-answer" element={<AIAnswerComponent />} />
          {/* ... other routes ... */}

        </Routes>
      </main>

      {/* Renders the Footer component */}
      <Footer />
    </div>
  );
}

export default App;
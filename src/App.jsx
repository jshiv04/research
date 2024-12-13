import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from "./pages/Home";
import Literature from "./pages/Literature";
import About from "./pages/About";
import Datasets from "./pages/Datasets";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className='container'>
      <Router>
        <Navbar />
        <div className='content'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/literature" element={<Literature />} />
            <Route path="/datasets" element={<Datasets />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

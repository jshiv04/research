import React from 'react';
import iit from '../assets/logo.png';
import SearchIcon from "@mui/icons-material/Search";
import CartIcon from '@mui/icons-material/ShoppingCartRounded';
import LoginIcon from '@mui/icons-material/LoginRounded';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import '../styles/Navbar.css';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='top-bar'>
        <img src={iit} alt="IITM" className='Logo' />
        <div className='search-box'>
          <input type="text" placeholder='Search'/>
          <SearchIcon />
        </div>
        <div className='cart'>
          <ul>
            <li>
              <CartIcon />
              Cart                    
            </li>
            <li>
              <LoginIcon />
              Login
            </li>
          </ul>
        </div>
      </div>
      <div className='bottom-bar'>
        <ul>
          <li><Link to="/">Home <ArrowDownIcon /></Link></li>
          <li><Link to="/about">About <ArrowDownIcon /></Link></li>
          <li><Link to="/literature">Literature <ArrowDownIcon /></Link></li>
          <li><Link to="/datasets">Datasets <ArrowDownIcon /></Link></li>
          <li><Link to="/">Clinical Data <ArrowDownIcon /></Link></li>
          <li><Link to="/">Drugs/Target <ArrowDownIcon /></Link></li>
          <li><Link to="/">RS Prediction <ArrowDownIcon /></Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;

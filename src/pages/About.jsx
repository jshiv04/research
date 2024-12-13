import React from 'react'
import '../styles/About.css';
import iit from '../assets/iit1.jpg'

const About = () => {
  return (
    <div className='about' style={{ backgroundImage: `url(${iit})` }}>
      <h1>About</h1>
    </div>
  )
}

export default About

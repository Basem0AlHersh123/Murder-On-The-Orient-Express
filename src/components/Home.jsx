import React from 'react'
import Hero from './hero';
// import Destinations from './Destinations';
import Categories from './categories.jsx';
import Testimonials from './testimonials.jsx';
import HeroCarousel from './HeroCarousel';
const Home = () => {
  return (
    <>  
        <Hero />        
      <HeroCarousel />
      <Testimonials/>
      <Categories />
      </>
    
  )
}

export default Home

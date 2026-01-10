// 📁 src/App.jsx
// import React from 'react';
import NavigationBar from './components/Nav.jsx';
import HeroCarousel from './components/HeroCarousel';
import Hero from './components/hero';
// import Destinations from './components/Destinations';
import Footer from './components/Footer';
import Categories from './components/categories.jsx';
import Testimonials from './components/testimonials.jsx';
// import { testimonials } from './data.js';
import Home from './components/Home.jsx';
import SignIn from './components/SignIn.jsx';
import {Routes,Route} from 'react-router-dom';
// react array function  extension  rafce
import About from './components/about.jsx';
import React from 'react';
import Contact from './components/ContactUs.jsx';

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/destination' element={<Categories/>}/>
        <Route path='/blog' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/signin' element={<SignIn/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;


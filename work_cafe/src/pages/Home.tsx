import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import Hero from '../components/Home/Hero';
import FeaturedCafes from '../components/Home/FeaturedCafes';
import HowItWorks from '../components/Home/HowItWorks';
import FeatureHighlights from '../components/Home/FeatureHighlights';
import { initializeAnimations } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  useEffect(() => {
    // Initialize global scroll animations
    initializeAnimations();
    
    // Cleanup ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <FeaturedCafes />
        <HowItWorks />
        <FeatureHighlights />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
import React, { useEffect, useRef } from 'react';
import { Wifi, Zap, Coffee, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="feature-card p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="mb-4 text-orange-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeatureHighlights: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      // Heading animation
      gsap.fromTo(
        '.features-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      
      // Feature cards stagger animation
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="features-heading text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-3">Discover Your Perfect Cafe</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the ideal cafe for work, relaxation, or socializing with all the details you need for a great experience.
          </p>
        </div>
        
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature 
            icon={<Wifi size={36} />} 
            title="WiFi Quality" 
            description="Discover cafes with fast and reliable WiFi for work or streaming."
          />
          
          <Feature 
            icon={<Zap size={36} />} 
            title="Power Outlets" 
            description="Find cafes with ample power outlets to keep your devices charged."
          />
          
          <Feature 
            icon={<Coffee size={36} />} 
            title="Comfort Level" 
            description="Explore cafes with a comfort rating to match your preferred ambiance."
          />
          
          <Feature 
            icon={<MapPin size={36} />} 
            title="Amenities" 
            description="From prayer rooms to meeting spaces, find the special amenities you need."
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
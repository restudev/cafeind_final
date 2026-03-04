import React, { useEffect, useRef } from 'react';
import { Search, Coffee, MapPin, Zap } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: 'search' | 'coffee' | 'map-pin' | 'zap';
  iconColor: string;
  bgColor: string;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon, iconColor, bgColor }) => {
  const iconComponents = {
    'search': <Search size={24} />,
    'coffee': <Coffee size={24} />,
    'map-pin': <MapPin size={24} />,
    'zap': <Zap size={24} />
  };

  return (
    <div className="step-card relative flex flex-col items-center text-center">
      <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-white font-bold text-sm`}>
        {number}
      </div>
      <div className={`w-16 h-16 ${bgColor} ${iconColor} rounded-full flex items-center justify-center mb-4`}>
        {iconComponents[icon]}
      </div>
      <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      // Heading animation
      gsap.fromTo(
        '.hiw-heading',
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
      
      // Steps stagger animation
      gsap.fromTo(
        '.step-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.steps-container',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      
      // Draw connector line animation
      // gsap.fromTo(
      //   '.connector-line',
      //   { width: '0%' },
      //   {
      //     width: '100%',
      //     duration: 1.5,
      //     ease: 'power2.inOut',
      //     scrollTrigger: {
      //       trigger: '.steps-container',
      //       start: 'top 70%',
      //       toggleActions: 'play none none reverse'
      //     }
      //   }
      // );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="hiw-heading text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-3">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Finding your ideal work cafe is easy with  Caféind. Just follow these simple steps to discover your new favorite spot!
          </p>
        </div>
        
        <div className="steps-container relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Connector line for desktop */}
          <div className="connector-line hidden lg:block absolute top-8 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-1 bg-blue-200 -z-10"></div>
          
          <Step 
            number={1}
            title="Search & Filter"
            description="Browse cafes by location, WiFi quality, amenities, and price level to find your perfect match."
            icon="search"
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
          />
          
          <Step 
            number={2}
            title="Check the Details"
            description="View photos, menus, and detailed information about each cafe's workspace features."
            icon="coffee"
            iconColor="text-orange-600"
            bgColor="bg-orange-100"
          />
          
          <Step 
            number={3}
            title="Choose Location"
            description="Select the cafe that best matches your preferences and working style."
            icon="map-pin"
            iconColor="text-green-600"
            bgColor="bg-green-100"
          />
          
          <Step 
            number={4}
            title="Enjoy Productive Work"
            description="Visit your chosen cafe and enjoy a productive remote work session in a great environment."
            icon="zap"
            iconColor="text-purple-600"
            bgColor="bg-purple-100"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../common/Button';
import CafeCard from '../Cafes/CafeCard'; // Import the provided CafeCard component
import { Cafe } from '../../types/cafe';

gsap.registerPlugin(ScrollTrigger);

const FeaturedCafes: React.FC = () => {
  const [featuredCafes, setFeaturedCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch top 3 cafes with highest average ratings
  useEffect(() => {
    const fetchTopCafes = async () => {
      try {
        const response = await fetch('http://localhost/CAFEIND_API/api/get_cafes.php?top=3');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch cafes');
        }

        // Calculate average rating for sorting
        const cafesWithRatings = result.data.map((cafe: Cafe) => {
          const reviews = cafe.reviews || [];
          const avgRating =
            reviews.length > 0
              ? (reviews.reduce((acc, review) => acc + review.wifiQuality + review.powerOutlets + review.comfortLevel, 0) / (reviews.length * 3))
              : 0;
          return { ...cafe, avgRating };
        });

        // Sort by average rating and take top 3
        const topCafes = cafesWithRatings
          .sort((a: Cafe & { avgRating: number }, b: Cafe & { avgRating: number }) => b.avgRating - a.avgRating)
          .slice(0, 3);

        setFeaturedCafes(topCafes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching top cafes:', err);
        setError('Failed to load featured cafes. Please try again later.');
        setLoading(false);
      }
    };

    fetchTopCafes();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (sectionRef.current) {
      // Heading animation: Fade-in with slight upward motion
      gsap.fromTo(
        '.featured-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation: Fade-in with upward motion
      gsap.fromTo(
        '.cafe-card-wrapper',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: '.featured-cards',
            start: 'top 75%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Button animation: Fade-in with slight delay
      gsap.fromTo(
        '.discover-button',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'sine.inOut',
          delay: 0.3,
          scrollTrigger: {
            trigger: '.featured-cards',
            start: 'top 75%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 py-16">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-16">{error}</div>;
  }

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="featured-heading flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900">Top Cafes</h2>
          <Link to="/cafes" className="flex items-center text-orange-500 hover:text-orange-600 font-medium">
            View All
            <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="featured-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCafes.map((cafe, index) => (
            <div key={cafe.id} className="cafe-card-wrapper">
              <CafeCard cafe={cafe} index={index} />
            </div>
          ))}
        </div>

        <div className="discover-button mt-12 text-center">
          <Button variant="secondary" size="lg" className="mx-auto">
            <Link to="/cafes">Discover More Cafes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCafes;
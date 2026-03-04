import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X, Coffee, Search, Settings } from 'lucide-react';
import { gsap } from 'gsap';
import Button from '../common/Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Animate mobile menu opening
      gsap.fromTo(
        '.mobile-menu',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  }, [isOpen]);

  // Check for search param when component mounts
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Reset search state when route changes
  useEffect(() => {
    if (!location.pathname.includes('/cafes')) {
      setShowSearch(false);
      setSearchTerm('');
    }
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/cafes?search=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
      // Focus will be moved to the cafes page
    }
  };

  useEffect(() => {
    // Animate navbar on initial load
    gsap.fromTo(
      '.navbar',
      { y: -100 },
      { y: 0, duration: 0.5, ease: 'power3.out' }
    );
    
    gsap.fromTo(
      '.nav-item',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, stagger: 0.1, delay: 0.3, duration: 0.4 }
    );
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navbarClasses = `navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
  }`;

  const activeClass = "text-orange-500 font-semibold";
  const inactiveClass = "text-gray-700 hover:text-orange-500";

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center text-2xl font-bold text-blue-800"
          onClick={closeMenu}
        >
          <Coffee className="mr-2" size={32} />
          <span> Caféind</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({isActive}) => `nav-item ${isActive ? activeClass : inactiveClass}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/cafes" 
            className={({isActive}) => `nav-item ${isActive ? activeClass : inactiveClass}`}
          >
            Cafes
          </NavLink>
          <NavLink 
            to="/about" 
            className={({isActive}) => `nav-item ${isActive ? activeClass : inactiveClass}`}
          >
            About
          </NavLink>
          <NavLink 
            to="/admin" 
            className={({isActive}) => `nav-item ${isActive ? activeClass : inactiveClass} flex items-center`}
          >
            <Settings size={16} className="mr-1" />
            Admin
          </NavLink>
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search size={18} className="text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search cafes..." 
                className="bg-transparent outline-none w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button 
                type="submit" 
                className="ml-2 text-sm font-medium text-orange-500 hover:text-orange-600"
              >
                Search
              </button>
            </form>
          ) : (
            <Button 
              variant="primary"
              icon="search"
              onClick={() => setShowSearch(true)}
            >
              Find Cafes
            </Button>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="mobile-menu md:hidden bg-white w-full absolute top-full left-0 shadow-md">
          <div className="flex flex-col p-4 space-y-4">
            <NavLink 
              to="/" 
              className={({isActive}) => `${isActive ? activeClass : inactiveClass} py-2`}
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink 
              to="/cafes" 
              className={({isActive}) => `${isActive ? activeClass : inactiveClass} py-2`}
              onClick={closeMenu}
            >
              Cafes
            </NavLink>
            <NavLink 
              to="/about" 
              className={({isActive}) => `${isActive ? activeClass : inactiveClass} py-2`}
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink 
              to="/admin" 
              className={({isActive}) => `${isActive ? activeClass : inactiveClass} py-2 flex items-center`}
              onClick={closeMenu}
            >
              <Settings size={16} className="mr-1" />
              Admin
            </NavLink>
            <Button 
              variant="primary"
              icon="search"
              fullWidth
              onClick={() => navigate('/cafes')}
            >
              Find Cafes
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
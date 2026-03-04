import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu as MenuIcon, Coffee } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Caféind</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/cafes" className="text-gray-600 hover:text-blue-600 font-medium">Cafes</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">Contact</Link>
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/admin/login" className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Link>
            <button className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/cafes" className="text-gray-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Cafes</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
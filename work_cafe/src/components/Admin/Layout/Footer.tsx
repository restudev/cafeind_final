import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Coffee className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Caféind</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Discover the best work-friendly cafes in Semarang. Perfect spots for remote work, meetings, or study sessions.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm">Home</Link>
              </li>
              <li>
                <Link to="/cafes" className="text-gray-600 hover:text-blue-600 text-sm">Cafes</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Areas */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Areas</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cafes?area=Semarang Tengah" className="text-gray-600 hover:text-blue-600 text-sm">Semarang Tengah</Link>
              </li>
              <li>
                <Link to="/cafes?area=Semarang Selatan" className="text-gray-600 hover:text-blue-600 text-sm">Semarang Selatan</Link>
              </li>
              <li>
                <Link to="/cafes?area=Semarang Barat" className="text-gray-600 hover:text-blue-600 text-sm">Semarang Barat</Link>
              </li>
              <li>
                <Link to="/cafes?area=Semarang Timur" className="text-gray-600 hover:text-blue-600 text-sm">Semarang Timur</Link>
              </li>
              <li>
                <Link to="/cafes?area=Semarang Utara" className="text-gray-600 hover:text-blue-600 text-sm">Semarang Utara</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
            <p className="text-gray-600 text-sm mb-2">Have questions or suggestions?</p>
            <a href="mailto:info@cafeind.com" className="text-blue-600 hover:text-blue-800 text-sm">info@cafeind.com</a>
            <p className="text-gray-600 text-sm mt-4">Jl. Pemuda No. 123<br />Semarang, Central Java<br />Indonesia</p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 Caféind. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-gray-500 hover:text-blue-600 text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-blue-600 text-sm">Terms of Service</Link>
            <Link to="/admin/login" className="text-gray-500 hover:text-blue-600 text-sm">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Coffee, Facebook, Instagram, Mail, Phone } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  useEffect(() => {
    gsap.fromTo(
      ".footer-content",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".footer",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <footer className="footer bg-blue-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="footer-content grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Coffee className="mr-2" size={28} />
              <span className="text-xl font-bold"> Caféind</span>
            </div>
            <p className="text-blue-200 mb-4">
              Finding the perfect cafe to work from has never been easier.
              Discover cozy spots with great WiFi, power outlets, and vibes.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-blue-200 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                className="text-blue-200 hover:text-white"
                aria-label="X (Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M18.36 2H21L14.3 10.06L22.5 22H15.66L10.6 15.26L4.82 22H2L9.06 13.36L1.97 2H9L13.6 8.2L18.36 2ZM16.88 20H18.56L7.28 4H5.5L16.88 20Z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                className="text-blue-200 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cafes" className="text-blue-200 hover:text-white">
                  Cafes
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-blue-200 hover:text-white">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Areas</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/cafes?area=Pemuda"
                  className="text-blue-200 hover:text-white"
                >
                  Semarang Tengah
                </Link>
              </li>
              <li>
                <Link
                  to="/cafes?area=Semarang Barat"
                  className="text-blue-200 hover:text-white"
                >
                  Semarang Barat
                </Link>
              </li>
              <li>
                <Link
                  to="/cafes?area=Semarang Selatan"
                  className="text-blue-200 hover:text-white"
                >
                  Semarang Selatan
                </Link>
              </li>
              <li>
                <Link
                  to="/cafes?area=Tembalang"
                  className="text-blue-200 hover:text-white"
                >
                  Tembalang
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-blue-200" />
                <a
                  href="mailto:info@cafeind.com"
                  className="text-blue-200 hover:text-white"
                >
                  info@cafeind.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-blue-200" />
                <a
                  href="tel:+6281234567890"
                  className="text-blue-200 hover:text-white"
                >
                  +62 812 3456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-blue-300 text-sm">
          <p>
            © {new Date().getFullYear()} Caféind Semarang. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
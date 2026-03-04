import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Coffee, Wifi, Zap, Heart } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { initializeAnimations } from "../utils/animations";
import { Instagram, Github, Linkedin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  useEffect(() => {
    initializeAnimations();

    gsap.fromTo(
      ".about-header",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    );

    gsap.utils.toArray<HTMLElement>(".about-section").forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    gsap.fromTo(
      ".team-member",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".team-grid",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="about-header text-center mb-16">
            <Coffee size={60} className="mx-auto mb-4 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              About Caféind Semarang
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover Semarang’s best work-from-cafe spots, designed for remote
              workers and professionals craving productivity and comfort.
            </p>
          </div>

          <div className="about-section mb-16">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg"
                    alt="People working in a cafe"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">
                    Our Story
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Caféind Semarang began with our hunt for the perfect work
                    cafe. As remote workers, we craved spots with fast WiFi,
                    comfy seats, and plenty of outlets.
                  </p>
                  <p className="text-gray-700 mb-4">
                    We built Caféind to help Semarang’s professionals find cafes
                    that feel like a second office, from quiet corners to
                    vibrant hubs.
                  </p>
                  <p className="text-gray-700">
                    Join our community, share your top picks, and make every
                    work-from-cafe moment productive and cozy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-section mb-16">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">
              Why Choose Caféind?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Blazing-Fast WiFi
                </h3>
                <p className="text-gray-600">
                  We test WiFi at every cafe to guarantee smooth video calls and
                  uploads.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Plenty of Power Outlets
                </h3>
                <p className="text-gray-600">
                  We check outlet locations and numbers so your devices stay
                  powered.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Top Comfort Level
                </h3>
                <p className="text-gray-600">
                  Our comfort rating finds cafes with cozy vibes for focused
                  work.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Support Local
                </h3>
                <p className="text-gray-600">
                  We believe in supporting local businesses that create
                  welcoming spaces for workers.
                </p>
              </div>
            </div>
          </div>

          <div className="about-section mb-16">
            <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">
              Our Developers
            </h2>
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0 items-center justify-center">
              <div className="team-member bg-white rounded-2xl shadow-md overflow-hidden px-8 py-10 flex flex-col items-center text-center w-full md:w-1/2 max-w-md transition-transform duration-300 hover:-rotate-2">
                <img
                  src="/images/ava1.jfif"
                  alt="Restu Lestari"
                  className="w-28 h-28 rounded-full mb-4 object-cover border-4 border-orange-100"
                  onError={(e) => {
                    console.error("Failed to load avatar image:", e);
                    e.currentTarget.src =
                      "https://via.placeholder.com/112?text=Avatar"; 
                  }}
                />
                <h3 className="text-xl font-semibold text-blue-900 mb-1">
                  Restu Lestari
                </h3>
                <p className="text-gray-600 mb-3">Back-end</p>
                <p className="text-gray-700 mb-4 text-sm text-justify">
                  Handles app logic, data, and server communication for a
                  stable, secure experience.
                </p>
                <div className="flex space-x-4 mt-2">
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Restu’s GitHub"
                    className="text-gray-600 hover:text-black transform hover:scale-110 transition-transform"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href="https://linkedin.com/in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Restu’s LinkedIn"
                    className="text-blue-700 hover:text-blue-900 transform hover:scale-110 transition-transform"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="https://instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Restu’s Instagram"
                    className="text-pink-600 hover:text-pink-700 transform hover:scale-110 transition-transform"
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </div>

              <div className="team-member bg-white rounded-2xl shadow-md overflow-hidden px-8 py-10 flex flex-col items-center text-center w-full md:w-1/2 max-w-md transition-transform duration-300 hover:rotate-2">
                <img
                  src="/images/ava2.jfif"
                  alt="Safara Risda"
                  className="w-28 h-28 rounded-full mb-4 object-cover border-4 border-green-100"
                  onError={(e) => {
                    console.error("Failed to load avatar image:", e);
                    e.currentTarget.src =
                      "https://via.placeholder.com/112?text=Avatar"; 
                  }}
                />
                <h3 className="text-xl font-semibold text-blue-900 mb-1">
                  Safara Risda
                </h3>
                <p className="text-gray-600 mb-3">Front-end </p>
                <p className="text-gray-700 mb-4 text-sm text-justify">
                  Designs responsive, user-friendly interfaces for a smooth and
                  engaging experience.
                </p>
                <div className="flex space-x-4 mt-2">
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Safara’s GitHub"
                    className="text-gray-600 hover:text-black transform hover:scale-110 transition-transform"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href="https://linkedin.com/in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Safara’s LinkedIn"
                    className="text-blue-700 hover:text-blue-900 transform hover:scale-110 transition-transform"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="https://instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Safara’s Instagram"
                    className="text-pink-600 hover:text-pink-700 transform hover:scale-110 transition-transform"
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
          />

          <div className="about-section">
            <div className="bg-blue-50 rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Love a Work Cafe?
              </h2>
              <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
                Share it with Semarang’s remote workers to inspire their next
                productive day.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="/cafe-form"
                  className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Add Cafe Now
                </a>
                <a
                  href="#"
                  className="px-6 py-3 bg-white text-blue-800 border border-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Follow Us on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

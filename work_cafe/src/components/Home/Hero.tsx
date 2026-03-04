import React, { useEffect, useRef, useState } from "react";
import { Coffee, Search, Wifi, Zap, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);
  const [wifiStrength, setWifiStrength] = useState(0);
  const [powerLevel, setPowerLevel] = useState(0);
  const [comfortRating, setComfortRating] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const words = ["Perfect", "Cozy", "Boost"];

  useEffect(() => {
    setIsVisible(true);

    const typingInterval = setInterval(
      () => {
        const currentWord = words[wordIndex];
        if (isTyping) {
          if (charIndex <= currentWord.length) {
            setTypingText(currentWord.substring(0, charIndex));
            setCharIndex((prev) => prev + 1);
          } else {
            setIsTyping(false);
            setTimeout(() => setIsTyping(false), 1000);
          }
        } else {
          if (charIndex > 0) {
            setTypingText(currentWord.substring(0, charIndex - 1));
            setCharIndex((prev) => prev - 1);
          } else {
            setWordIndex((prev) => (prev + 1) % words.length);
            setIsTyping(true);
            setCharIndex(0);
          }
        }
      },
      isTyping ? 100 : 100
    );

    const wifiInterval = setInterval(() => {
      setWifiStrength((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);

    const powerInterval = setInterval(() => {
  setPowerLevel((prev) => {
    if (prev >= 100) {
      setTimeout(() => setPowerLevel(0), 500);
      return prev;
    }
    return prev + 2;
  });
}, 100);

    const comfortInterval = setInterval(() => {
      setComfortRating((prev) => (prev >= 5 ? 0 : prev + 0.05));
    }, 100);

    let timeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect();
          setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }
      }, 50);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(typingInterval);
      clearInterval(wifiInterval);
      clearInterval(powerInterval);
      clearInterval(comfortInterval);
      clearTimeout(timeout);
    };
  }, [wordIndex, charIndex, isTyping, words]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 transition-all duration-500 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400 animate-twinkle"
            : i < rating
            ? "text-yellow-400 fill-yellow-400/50"
            : "text-gray-300"
        }`}
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ));
  };

  return (
    <div
      ref={heroRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #fff7ed 100%)
        `,
      }}
    >
      {/* Desktop Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-24 left-12 animate-float-1">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-orange-600/30 rounded-full blur-xl animate-pulse-glow"></div>
            <div className="relative bg-white/95 backdrop-blur-md p-4 rounded-full shadow-2xl border-2 border-orange-300/70 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-500 hover:scale-110">
              <Coffee className="w-8 h-8 text-orange-600 animate-pulse-gentle" />
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <div className="absolute top-28 right-16 animate-float-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-full blur-xl animate-pulse-glow"></div>
            <div className="relative bg-white/95 backdrop-blur-md p-4 rounded-full shadow-2xl border-2 border-blue-300/70 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-500 hover:scale-110">
              <Search className="w-8 h-8 text-blue-600 animate-spin-gentle" />
            </div>
            <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full animate-twinkle"></div>
          </div>
        </div>
        <div className="absolute bottom-36 left-16 animate-float-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-full blur-xl animate-pulse-glow"></div>
            <div className="relative bg-white/95 backdrop-blur-md p-4 rounded-full shadow-2xl border-2 border-green-300/70 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-500 hover:scale-110">
              <Wifi className="w-8 h-8 text-green-600 animate-signal-pulse" />
            </div>
            <div className="absolute top-2 right-2 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-wave-1"></div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-wave-2"></div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-wave-3"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-28 right-12 animate-float-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 rounded-full blur-xl animate-pulse-glow"></div>
            <div className="relative bg-white/95 backdrop-blur-md p-4 rounded-full shadow-2xl border-2 border-yellow-300/70 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all duration-500 hover:scale-110">
              <Zap className="w-8 h-8 text-yellow-600 animate-electric" />
            </div>
            <div className="absolute -top-3 -right-3 w-6 h-6">
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-spark-1"></div>
              <div className="absolute top-2 right-3 w-1 h-1 bg-yellow-500 rounded-full animate-spark-2"></div>
              <div className="absolute top-3 right-1 w-1 h-1 bg-yellow-400 rounded-full animate-spark-3"></div>
            </div>
          </div>
        </div>
        <div className="absolute top-60 left-1/3 animate-float-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/25 to-purple-600/25 rounded-full blur-md animate-pulse-glow"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-3.5 rounded-full shadow-xl border-2 border-purple-300/60 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-400 hover:scale-105">
              <Heart className="w-6 h-6 text-purple-500 animate-heartbeat" />
            </div>
          </div>
        </div>
        <div className="absolute top-1/3 left-1/4 animate-orbit-1">
          <div className="w-2.5 h-2.5 bg-blue-400/60 rounded-full animate-twinkle"></div>
        </div>
        <div className="absolute top-2/3 right-1/4 animate-orbit-2">
          <div className="w-2 h-2 bg-orange-400/60 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-1/2 left-3/4 animate-orbit-3">
          <div className="w-1.5 h-1.5 bg-green-400/60 rounded-full animate-bounce"></div>
        </div>
        <div className="absolute top-36 right-1/4 animate-float-text-1">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-gray-700 shadow-lg border border-gray-200/50">
            💼 Meeting Room
          </div>
        </div>
        <div className="absolute bottom-48 left-1/4 animate-float-text-2">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-gray-700 shadow-lg border border-gray-200/50">
            🕌 Praying Room
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-blue-300/50 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-orange-200/50 rounded-lg rotate-45 animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 border-2 border-blue-300/30 rounded-full animate-bounce-slow"></div>
      </div>

      <div className="container mx-auto px-6 pt-16 pb-8 md:py-16 lg:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-10rem)]">
          <div className="w-full lg:w-1/2 lg:pr-16 mb-16 lg:mb-0">
            <div
              className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-100 border border-blue-300 rounded-full mb-8 transform transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
            >
              <Search className="w-4 h-4 mr-2 text-blue-600 animate-pulse" />
              <span className="text-sm text-blue-800 font-medium">
                Find cafes open 24/7
              </span>
            </div>
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 leading-none mb-8 transform transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Find Your
              <div className="relative inline-block ml-4">
                <span className="text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text animate-gradient">
                  {typingText}
                  <span className="animate-blink text-orange-500">|</span>
                </span>
                <div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-expand-contract"></div>
              </div>
              <br />
              <span className="text-transparent bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text relative animate-gradient-blue">
                Work Cafe
                <div className="absolute -top-2 -right-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              </span>
            </h1>
            <p
              className={`text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 leading-relaxed sm:leading-relaxed lg:leading-loose transform transition-all duration-1000 delay-200 hover:text-gray-700 hover:shadow-text-sm lg:hover:shadow-text-md ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              Discover Semarang's most productive workspaces with blazing-fast
              WiFi, ample power outlets, and the perfect ambiance to fuel your
              creativity.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-6 transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Link
                to="/cafes"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 active:scale-95 inline-flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <div className="relative flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2 group-hover:animate-spin" />
                  Explore Cafes Now
                </div>
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-blue-300 text-blue-800 font-bold rounded-xl hover:bg-blue-50 hover:text-blue-900 transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:scale-105 active:scale-95 inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="lg:hidden absolute inset-0 pointer-events-none z-20">
              <div className="absolute -top-8 -left-6 animate-float-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-orange-600/30 rounded-full blur-lg animate-pulse-glow"></div>
                  <div className="relative bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-xl border-2 border-orange-300/70 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all duration-400 hover:scale-105">
                    <Coffee className="w-6 h-6 text-orange-600 animate-pulse-gentle" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="absolute top-16 -right-4 animate-float-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-full blur-lg animate-pulse-glow"></div>
                  <div className="relative bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-xl border-2 border-green-300/70 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-400 hover:scale-105">
                    <Wifi className="w-6 h-6 text-green-600 animate-signal-pulse" />
                  </div>
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-twinkle"></div>
                </div>
              </div>
              <div className="absolute -bottom-1 -left-8 animate-float-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 rounded-full blur-lg animate-pulse-glow"></div>
                  <div className="relative bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-xl border-2 border-yellow-300/70 hover:shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-all duration-400 hover:scale-105">
                    <Zap className="w-6 h-6 text-yellow-600 animate-electric" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-6 animate-float-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-full blur-lg animate-pulse-glow"></div>
                  <div className="relative bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-xl border-2 border-blue-300/70 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-400 hover:scale-105">
                    <Search className="w-6 h-6 text-blue-600 animate-spin-gentle" />
                  </div>
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full animate-twinkle"></div>
                </div>
              </div>
              <div className="absolute top-1/2 -left-10 transform -translate-y-1/2 animate-float-5">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/25 to-purple-600/25 rounded-full blur-md animate-pulse-glow"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border-2 border-purple-300/60 hover:shadow-[0_0_12px_rgba(168,85,247,0.5)] transition-all duration-400 hover:scale-105">
                    <Heart className="w-5 h-5 text-purple-500 animate-heartbeat" />
                  </div>
                </div>
              </div>
              <div className="absolute top-1/4 left-1/4 animate-orbit-1">
                <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-twinkle"></div>
              </div>
              <div className="absolute top-3/4 right-1/4 animate-orbit-2">
                <div className="w-1.5 h-1.5 bg-orange-400/60 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-1/2 right-1/6 animate-orbit-3">
                <div className="w-1.5 h-1.5 bg-green-400/60 rounded-full animate-bounce"></div>
              </div>
            </div>

            <div
              className={`relative group transform transition-all duration-1000 delay-400 z-10 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 border border-blue-300 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-500">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 mb-6 border border-blue-300">
                  <div className="flex items-center mb-4">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                      <div
                        className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <div className="flex-1 ml-3 bg-blue-100 rounded-lg px-3 py-1.5">
                      <span className="text-blue-600 text-xs text-center">
                        cafeind-smg.com
                      </span>
                    </div>
                  </div>
                  <div className="h-32 md:h-48 flex items-center justify-center relative overflow-hidden rounded-lg md:rounded-xl">
                    <img
                      src="/images/hero.jpg"
                      alt="Perfect cafe workspace"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 border border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-105 group flex flex-col">
                    <div className="text-center mb-3 h-16 flex flex-col justify-center">
                      <Wifi className="w-6 h-6 text-blue-600 mx-auto mb-2 animate-pulse-gentle" />
                      <p className="text-blue-900 font-medium text-sm leading-tight">
                        Fast WiFi
                      </p>
                      <p className="text-gray-600 text-xs">
                        {Math.round(wifiStrength)}+ Mbps
                      </p>
                    </div>
                    <div className="flex justify-center items-end space-x-1 mb-3 h-5">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`w-1.5 rounded-full transition-all duration-500 ${
                            wifiStrength > bar * 25
                              ? "bg-blue-500 animate-signal-bar"
                              : "bg-blue-200"
                          }`}
                          style={{
                            animationDelay: `${bar * 0.1}s`,
                            height:
                              wifiStrength > bar * 25
                                ? `${10 + bar * 2}px`
                                : "8px",
                          }}
                        />
                      ))}
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 animate-shimmer"
                        style={{ width: `${wifiStrength}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-4 border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105 group flex flex-col">
                    <div className="text-center mb-3 h-16 flex flex-col justify-center">
                      <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2 animate-electric" />
                      <p className="text-blue-900 font-medium text-sm leading-tight">
                        Power Outlets
                      </p>
                      <p className="text-gray-600 text-xs">Every table</p>
                    </div>
                    <div className="flex justify-center items-center mb-3 h-5">
                      <span
                        className="text-xl animate-emoji"
                        style={{
                          animationDelay: `${
                            powerLevel > 80
                              ? "0s"
                              : powerLevel > 50
                              ? "0.2s"
                              : "0.4s"
                          }`,
                        }}
                      >
                        {powerLevel > 80 ? "🔋" : powerLevel > 50 ? "🔋" : "🪫"}
                      </span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden relative">
                      <div
                        className="h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500 animate-charge"
                        style={{ width: `${powerLevel}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105 group flex flex-col">
                    <div className="text-center mb-3 h-16 flex flex-col justify-center">
                      <Heart className="w-6 h-6 text-green-600 mx-auto mb-2 animate-heartbeat" />
                      <p className="text-blue-900 font-medium text-sm leading-tight">
                        Comfort Level
                      </p>
                      <p className="text-gray-600 text-xs">
                        {comfortRating.toFixed(1)}/5.0
                      </p>
                    </div>
                    <div className="flex justify-center items-center space-x-0.5 mb-3 h-5">
                      {renderStars(comfortRating)}
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500 animate-glow"
                        style={{ width: `${(comfortRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse-success">
                🟢 Open Now
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-white/30 animate-slide-in">
                ⚡ Fast WiFi Available
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
        @keyframes expand-contract {
          0%,
          100% {
            width: 0%;
            opacity: 0;
          }
          50% {
            width: 100%;
            opacity: 1;
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes gradient-blue {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes charge {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
        @keyframes electric {
          0%,
          20%,
          40%,
          60%,
          80%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          10%,
          30%,
          50%,
          70% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes emoji {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          20% {
            opacity: 1;
            transform: scale(1.1);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.8);
          }
        }
        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.15);
          }
          50% {
            transform: scale(1.3);
          }
          75% {
            transform: scale(1.15);
          }
        }
        @keyframes pulse-gentle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }
        @keyframes pulse-success {
          0%,
          100% {
            background-color: rgb(34, 197, 94);
            transform: scale(1);
          }
          50% {
            background-color: rgb(22, 163, 74);
            transform: scale(1.05);
          }
        }
        @keyframes slide-in {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          100% {
            transform: translateX(0px);
            opacity: 1;
          }
        }
        @keyframes signal-bar {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.3);
          }
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-25px) translateX(-8px);
          }
        }
        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(12px);
          }
        }
        @keyframes float-4 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-22px) translateX(-10px);
          }
        }
        @keyframes float-5 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(8px);
          }
        }
        @keyframes float-text-1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
        }
        @keyframes float-text-2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-12px) translateX(-5px);
          }
        }
        @keyframes spin-gentle {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes signal-pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }
        @keyframes wave-1 {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes wave-2 {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes wave-3 {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes spark-1 {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(0, 0) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translate(-2px, -2px) scale(1.2);
          }
        }
        @keyframes spark-2 {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(0, 0) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translate(2px, 1px) scale(1.2);
          }
        }
        @keyframes spark-3 {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(0, 0) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translate(-1px, 2px) scale(1.2);
          }
        }
        @keyframes orbit-1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(10px);
          }
        }
        @keyframes orbit-2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(10px) translateX(-10px);
          }
        }
        @keyframes orbit-3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-8px) translateX(8px);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .animate-expand-contract {
          animation: expand-contract 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-gradient-blue {
          background-size: 200% 200%;
          animation: gradient-blue 4s ease infinite;
        }
        .animate-shimmer {
          background-size: 300% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-charge {
          background-size: 200% 100%;
          background-image: linear-gradient(
            90deg,
            rgba(251, 146, 60, 0.6) 0%,
            rgba(251, 146, 60, 1) 25%,
            rgba(234, 88, 12, 1) 50%,
            rgba(251, 146, 60, 1) 75%,
            rgba(251, 146, 60, 0.6) 100%
          );
          animation: charge 1.5s linear infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-electric {
          animation: electric 0.8s ease-in-out infinite;
        }
        .animate-emoji {
          animation: emoji 1s ease-in-out;
        }
        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-pulse-success {
          animation: pulse-success 2s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slide-in 1s ease-out;
        }
        .animate-signal-bar {
          animation: signal-bar 1s ease-in-out infinite;
        }
        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 3.5s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-3 5s ease-in-out infinite;
        }
        .animate-float-4 {
          animation: float-4 4.5s ease-in-out infinite;
        }
        .animate-float-5 {
          animation: float-5 3s ease-in-out infinite;
        }
        .animate-float-text-1 {
          animation: float-text-1 3.5s ease-in-out infinite;
        }
        .animate-float-text-2 {
          animation: float-text-2 4s ease-in-out infinite;
        }
        .animate-spin-gentle {
          animation: spin-gentle 8s linear infinite;
        }
        .animate-signal-pulse {
          animation: signal-pulse 2s ease-in-out infinite;
        }
        .animate-wave-1 {
          animation: wave-1 1.5s ease-in-out infinite 0.2s;
        }
        .animate-wave-2 {
          animation: wave-2 1.5s ease-in-out infinite 0.4s;
        }
        .animate-wave-3 {
          animation: wave-3 1.5s ease-in-out infinite 0.6s;
        }
        .animate-spark-1 {
          animation: spark-1 1.2s ease-in-out infinite;
        }
        .animate-spark-2 {
          animation: spark-2 1.2s ease-in-out infinite 0.3s;
        }
        .animate-spark-3 {
          animation: spark-3 1.2s ease-in-out infinite 0.6s;
        }
        .animate-orbit-1 {
          animation: orbit-1 3s ease-in-out infinite;
        }
        .animate-orbit-2 {
          animation: orbit-2 3.5s ease-in-out infinite;
        }
        .animate-orbit-3 {
          animation: orbit-3 4s ease-in-out infinite;
        }
        .animate-spin {
          animation: spin 1s linear;
        }
      `}</style>
    </div>
  );
};

export default Hero;

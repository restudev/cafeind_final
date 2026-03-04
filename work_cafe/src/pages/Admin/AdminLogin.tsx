import { useEffect, useRef, useState, FormEvent } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Coffee, ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { useAuth } from "../../contexts/AuthContext";

// Define Sticker interface for TypeScript
interface Sticker {
  src: string;
  initialPosition: { x: number; y: number };
  mobilePosition: { x: number; y: number };
  size: { width: number; height: number };
  mobileSize: { width: number; height: number };
  animation: { rotate: number; scale: number; delay: number };
}

const stickerImages: Sticker[] = [
  {
    src: "https://oatside.com/wp-content/uploads/2022/01/OS_StickerSetForWeb-30.svg",
    initialPosition: { x: -300, y: -150 },
    mobilePosition: { x: -150, y: -100 },
    size: { width: 100, height: 100 },
    mobileSize: { width: 60, height: 60 },
    animation: { rotate: 360, scale: 1.2, delay: 0.2 },
  },
  {
    src: "https://oatside.com/wp-content/uploads/2022/01/OS_StickerSetForWeb-11.svg",
    initialPosition: { x: 0, y: -300 },
    mobilePosition: { x: 0, y: -180 },
    size: { width: 100, height: 100 },
    mobileSize: { width: 60, height: 60 },
    animation: { rotate: 360, scale: 1.2, delay: 0.2 },
  },
  {
    src: "https://oatside.com/wp-content/uploads/2022/01/OS_StickerSetForWeb-12.svg",
    initialPosition: { x: 280, y: -150 },
    mobilePosition: { x: 140, y: -100 },
    size: { width: 80, height: 80 },
    mobileSize: { width: 50, height: 50 },
    animation: { rotate: -180, scale: 1.1, delay: 0.3 },
  },
  {
    src: "https://oatside.com/wp-content/uploads/2022/01/OS_StickerSetForWeb-04.svg",
    initialPosition: { x: -280, y: 100 },
    mobilePosition: { x: -140, y: 80 },
    size: { width: 120, height: 120 },
    mobileSize: { width: 70, height: 70 },
    animation: { rotate: 270, scale: 1.3, delay: 0.4 },
  },
  {
    src: "https://oatside.com/wp-content/uploads/2022/01/OS_StickerSetForWeb-03.svg",
    initialPosition: { x: 250, y: 190 },
    mobilePosition: { x: 130, y: 120 },
    size: { width: 90, height: 90 },
    mobileSize: { width: 55, height: 55 },
    animation: { rotate: 180, scale: 1.2, delay: 0.5 },
  },
  {
    src: "https://oatside.com/wp-content/uploads/2022/01/OS_StickerSetForWeb-32.svg",
    initialPosition: { x: 0, y: 280 },
    mobilePosition: { x: 0, y: 160 },
    size: { width: 110, height: 110 },
    mobileSize: { width: 65, height: 65 },
    animation: { rotate: -90, scale: 1.1, delay: 0.6 },
  },
];

const AdminLogin: React.FC = () => {
  const { login, isAuthenticated, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const loginCardRef = useRef<HTMLDivElement>(null);
  const stickersRef = useRef<(HTMLImageElement | null)[]>([]);

  // Initialize stickersRef
  if (stickersRef.current.length === 0) {
    stickersRef.current = Array(stickerImages.length).fill(null);
  }

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      loginCardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    stickersRef.current.forEach((sticker) => {
      if (sticker) {
        gsap.set(sticker, {
          opacity: 0,
          scale: 0,
          x: 0,
          y: 0,
          rotation: 0,
          visibility: "hidden",
        });
      }
    });

    const container = containerRef.current;

    if (isMobile && container) {
      setTimeout(() => {
        animateStickersIn();
        setTimeout(() => {
          animateStickersOut();
        }, 4000);
      }, 1000);
    } else if (container) {
      container.addEventListener("mouseenter", animateStickersIn);
      container.addEventListener("mouseleave", animateStickersOut);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", animateStickersIn);
        container.removeEventListener("mouseleave", animateStickersOut);
      }
    };
  }, [isMobile]);

  const animateStickersIn = () => {
    stickersRef.current.forEach((sticker, index) => {
      if (sticker) {
        const { initialPosition, mobilePosition, size, mobileSize, animation } =
          stickerImages[index];
        const position = isMobile ? mobilePosition : initialPosition;
        const dimensions = isMobile ? mobileSize : size;

        gsap.set(sticker, {
          visibility: "visible",
          width: dimensions.width,
          height: dimensions.height,
        });

        gsap.to(sticker, {
          opacity: 1,
          scale: animation.scale,
          rotation: animation.rotate,
          x: position.x,
          y: position.y,
          duration: 0.8,
          delay: animation.delay,
          ease: "back.out(1.7)",
        });
      }
    });

    gsap.to(loginCardRef.current, {
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      y: -5,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const animateStickersOut = () => {
    stickersRef.current.forEach((sticker) => {
      if (sticker) {
        gsap.to(sticker, {
          opacity: 0,
          scale: 0,
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(sticker, { visibility: "hidden" });
          },
        });
      }
    });

    gsap.to(loginCardRef.current, {
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleCardTap = () => {
    if (isMobile) {
      const anyVisible = stickersRef.current.some(
        (sticker) =>
          sticker && getComputedStyle(sticker).visibility === "visible"
      );
      if (anyVisible) {
        animateStickersOut();
      } else {
        animateStickersIn();
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple validation
    if (!email.includes("@") || password.length < 6) {
      setError(
        "Please enter a valid email and password (minimum 6 characters)"
      );
      setLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(authError || "Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8 overflow-hidden relative">
      {/* Map-style background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Map grid lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px bg-gray-500"
              style={{ top: `${(i + 1) * 8}%` }}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px bg-gray-500"
              style={{ left: `${(i + 1) * 8}%` }}
            />
          ))}
        </div>
        {/* Map routes/roads */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M10,30 Q30,10 50,20 T90,30"
            stroke="#94A3B8"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M5,50 Q25,60 45,45 T95,40"
            stroke="#94A3B8"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M20,80 Q40,70 60,75 T90,60"
            stroke="#94A3B8"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M40,5 Q45,35 30,60 T25,90"
            stroke="#94A3B8"
            strokeWidth="0.6"
            fill="none"
          />
          <path
            d="M70,10 Q65,40 80,65 T75,95"
            stroke="#94A3B8"
            strokeWidth="0.6"
            fill="none"
          />
        </svg>
        {/* Coffee cafe locations */}
        <div className="absolute inset-0">
          {[
            { x: 15, y: 25, size: 12 },
            { x: 35, y: 45, size: 16 },
            { x: 65, y: 30, size: 14 },
            { x: 80, y: 60, size: 15 },
            { x: 25, y: 70, size: 12 },
            { x: 50, y: 80, size: 12 },
          ].map((cafe, index) => (
            <div
              key={`cafe-${index}`}
              className="absolute"
              style={{ left: `${cafe.x}%`, top: `${cafe.y}%` }}
            >
              <div
                className={`w-${cafe.size} h-${cafe.size} flex items-center justify-center`}
              >
                <div className="relative">
                  <div className="absolute -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full relative opacity-70">
                      <div className="absolute w-6 h-6 bg-blue-600 rounded-full -left-1.5 -top-1.5 animate-ping opacity-25"></div>
                      <div className="absolute w-10 h-10 bg-blue-400 rounded-full -left-3.5 -top-3.5 opacity-10"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {[
            { x: 10, y: 40 },
            { x: 20, y: 15 },
            { x: 30, y: 35 },
            { x: 45, y: 20 },
            { x: 55, y: 40 },
            { x: 60, y: 60 },
            { x: 75, y: 20 },
            { x: 85, y: 40 },
            { x: 40, y: 65 },
            { x: 35, y: 85 },
            { x: 70, y: 75 },
            { x: 90, y: 30 },
          ].map((cafe, index) => (
            <div
              key={`minor-cafe-${index}`}
              className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60"
              style={{ left: `${cafe.x}%`, top: `${cafe.y}%` }}
            />
          ))}
        </div>
        {/* City names */}
        <div className="absolute inset-0 text-blue-800">
          {[
            { name: "Semarang Tengah", x: 36, y: 46, size: "text-xs" },
            { name: "Semarang Utara", x: 66, y: 31, size: "text-xs" },
            { name: "Semarang Barat", x: 13, y: 26, size: "text-xs" },
            { name: "Semarang Selatan", x: 51, y: 81, size: "text-xs" },
            { name: "Semarang Timur", x: 81, y: 61, size: "text-xs" },
          ].map((city, index) => (
            <div
              key={`city-${index}`}
              className={`absolute ${city.size} font-medium opacity-30`}
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
            >
              {city.name}
            </div>
          ))}
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full max-w-md h-[600px] md:h-[600px] flex items-center justify-center"
      >
        {stickerImages.map((image, index) => (
          <img
            key={index}
            ref={(el) => (stickersRef.current[index] = el)}
            src={image.src}
            alt={`Sticker ${index + 1}`}
            className="absolute pointer-events-none"
            style={{
              opacity: 0,
              visibility: "hidden",
            }}
          />
        ))}
        <div
          ref={loginCardRef}
          className="bg-white w-full max-w-[440px] rounded-2xl overflow-hidden shadow-lg p-4 md:p-8"
          onClick={handleCardTap}
        >
          <div className="absolute top-4 left-4 md:top-6 md:left-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/");
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors duration-200"
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
          <div className="mb-8 md:mb-10 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-blue-100 rounded-full mb-3">
              <Coffee size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Caféind Admin
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Sign in to manage work cafe
              </p>
            </div>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  // placeholder="admin@cafeind.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  // placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
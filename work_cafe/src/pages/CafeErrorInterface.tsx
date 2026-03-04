import React, { useState, useEffect, useMemo } from "react";
import {
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Clock,
  Coffee,
  Sparkles,
  Timer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

interface FloatingElementProps {
  delay?: number;
  size?: string;
  color?: string;
  position?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  onClick,
  className = "",
  disabled = false,
}) => {
  const baseClasses =
    "px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 focus:ring-blue-400 shadow-lg hover:shadow-xl",
    secondary:
      "bg-white/90 backdrop-blur-sm text-blue-600 border border-blue-200/70 hover:bg-blue-50/90 hover:border-blue-300/70 focus:ring-blue-400 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white focus:ring-blue-400",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const FloatingElement: React.FC<FloatingElementProps> = ({
  delay = 0,
  size = "w-4 h-4",
  color = "bg-blue-100",
  position = "top-1/4 left-1/4",
}) => (
  <div
    className={`absolute ${position} ${size} ${color} rounded-full opacity-40 animate-pulse`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div
      className={`absolute inset-0 ${color} rounded-full animate-ping opacity-30`}
      style={{ animationDelay: `${delay}ms` }}
    ></div>
  </div>
);

const CafeErrorInterface: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null
  );

  // Mock last review time - 2 hours ago for demo
  const lastReviewTime = useMemo(
    () => new Date(Date.now() - 2 * 60 * 60 * 1000),
    []
  );
  const nextAllowedTime = useMemo(
    () => new Date(lastReviewTime.getTime() + 24 * 60 * 60 * 1000),
    [lastReviewTime]
  );

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = nextAllowedTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextAllowedTime]);

  const canSubmitReview = () => timeRemaining === null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/cafes");
  };

  const formatTime = (time: TimeRemaining) => {
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes
      .toString()
      .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`;
  };

  if (!canSubmitReview()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          {/* Large gradient orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-white/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2000ms" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-50/20 to-white/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1000ms" }}
          ></div>
        </div>

        {/* Floating Coffee Icons */}
        <div className="absolute top-16 left-8 opacity-20 animate-float">
          <Coffee className="h-6 w-6 text-blue-500" />
        </div>
        <div
          className="absolute top-32 right-12 opacity-15 animate-float"
          style={{ animationDelay: "1000ms" }}
        >
          <Coffee className="h-5 w-5 text-blue-400" />
        </div>
        <div
          className="absolute bottom-32 left-16 opacity-25 animate-float"
          style={{ animationDelay: "1500ms" }}
        >
          <Coffee className="h-7 w-7 text-blue-600" />
        </div>
        <div
          className="absolute top-1/2 right-8 opacity-18 animate-float"
          style={{ animationDelay: "2000ms" }}
        >
          <Coffee className="h-4 w-4 text-blue-500" />
        </div>

        <div className="max-w-2xl w-full text-center px-6 relative z-10">
          {/* Main Icon with Enhanced Design */}
          <div className="relative inline-flex items-center justify-center mb-8">
            {/* Multiple glow rings with different colors */}
            <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-blue-300/20 via-blue-400/30 to-white/20 animate-ping"></div>
            <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-blue-200/30 to-white/40 animate-pulse"></div>
            <div
              className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-blue-100/40 to-white/30 animate-pulse"
              style={{ animationDelay: "500ms" }}
            ></div>

            {/* Main icon container with glass effect */}
            <div className="relative w-20 h-20 rounded-full bg-white/70 backdrop-blur-md shadow-2xl animate-bounce flex items-center justify-center group hover:scale-110 transition-transform duration-300 border border-blue-200/50">
              <div className="absolute -top-2 -right-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
              </div>
              <Clock className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          {/* Title with Gradient Text */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent mb-2 relative">
              Oops! Too Soon
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 mx-auto rounded-full opacity-60"></div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-lg mx-auto">
            You've already shared your thoughts on this cafe today. Come back
            tomorrow to leave another review!
          </p>

          {/* Countdown Timer - Redesigned without card */}
          {timeRemaining && (
            <div className="mb-8 relative">
              {/* Timer background with glass effect */}
              <div className="inline-block px-12 py-8 bg-white/80 backdrop-blur-md rounded-3xl border border-blue-100/50 shadow-xl relative overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-white/60 to-blue-50/80 rounded-3xl"></div>

                <div className="relative">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Timer className="h-6 w-6 text-blue-600 animate-pulse" />
                    <span className="text-gray-700 font-semibold text-lg">
                      Time Remaining
                    </span>
                  </div>

                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent mb-3 font-mono tracking-wider">
                    {formatTime(timeRemaining)}
                  </div>

                  <div className="text-gray-600 text-base mb-4">
                    {timeRemaining.hours > 0
                      ? `${timeRemaining.hours}h ${timeRemaining.minutes}m remaining`
                      : timeRemaining.minutes > 0
                      ? `${timeRemaining.minutes}m ${timeRemaining.seconds}s remaining`
                      : `${timeRemaining.seconds} seconds remaining`}
                  </div>

                  {/* Enhanced Progress bar */}
                  <div className="w-48 bg-gray-200 rounded-full h-3 overflow-hidden mx-auto">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{
                        width: `${Math.max(
                          5,
                          ((24 * 60 * 60 * 1000 -
                            (timeRemaining.hours * 60 * 60 * 1000 +
                              timeRemaining.minutes * 60 * 1000 +
                              timeRemaining.seconds * 1000)) /
                            (24 * 60 * 60 * 1000)) *
                            100
                        )}%`,
                      }}
                    >
                      {/* Shimmer effect on progress bar */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Section - Without card design */}
          <div className="mb-8 flex items-center justify-center space-x-4 text-gray-600">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <p className="text-base">
              <span className="font-semibold text-gray-700">
                24-hour policy:
              </span>{" "}
              One review per cafe per day keeps things fair for everyone
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="primary"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-3 min-w-[160px] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <RefreshCw
                className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>{isRefreshing ? "Checking..." : "Check Status"}</span>
            </Button>

            <Button
              variant="secondary"
              onClick={handleGoBack}
              className="flex items-center space-x-3 min-w-[160px] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Browse Cafes</span>
            </Button>
          </div>

          {/* Floating decorative elements */}
          <FloatingElement
            delay={0}
            size="w-3 h-3"
            color="bg-blue-100"
            position="top-1/4 left-1/6"
          />
          <FloatingElement
            delay={1000}
            size="w-4 h-4"
            color="bg-blue-200"
            position="top-1/3 right-1/4"
          />
          <FloatingElement
            delay={500}
            size="w-2 h-2"
            color="bg-blue-100"
            position="bottom-1/4 left-1/3"
          />
          <FloatingElement
            delay={1500}
            size="w-5 h-5"
            color="bg-blue-200"
            position="top-1/2 right-1/6"
          />
          <FloatingElement
            delay={800}
            size="w-3 h-3"
            color="bg-blue-100"
            position="bottom-1/3 right-1/3"
          />
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // When user can submit review again
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-white/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2000ms" }}
        ></div>
      </div>

      <div className="max-w-2xl w-full text-center px-6 relative z-10">
        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-blue-300/20 to-blue-400/30 animate-ping"></div>
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-blue-200/30 to-white/40 animate-pulse"></div>

          <div className="relative w-20 h-20 rounded-full bg-white/80 backdrop-blur-md shadow-2xl animate-bounce flex items-center justify-center hover:scale-110 transition-transform duration-300 border border-blue-100/50">
            <Coffee className="h-10 w-10 text-blue-600" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent mb-2">
            Ready to Review!
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 mx-auto rounded-full opacity-60"></div>
        </div>

        <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-lg mx-auto">
          Perfect timing! The 24-hour window has passed and you're all set to
          share your next cafe experience.
        </p>

        <Button
          variant="primary"
          onClick={() => console.log("Navigate to review form")}
          className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 flex items-center space-x-3 mx-auto"
        >
          <Coffee className="h-5 w-5" />
          <span>Write Your Review</span>
        </Button>
      </div>
    </div>
  );
};

export default CafeErrorInterface;

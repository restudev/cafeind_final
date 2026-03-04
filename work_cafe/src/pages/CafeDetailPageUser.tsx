import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import ReCAPTCHA from "react-google-recaptcha";
import { Cafe, UserReview, MenuItem, Promo, CafeImage } from "../types/cafe";
import CafeHeader from "./../components/CafeDetail/CafeHeader";
import CafeImageSlider from "./../components/CafeDetail/CafeImageSlider";
import CafeRatingSummary from "../components/CafeDetail/CafeRatingsSummary";
import CafePromotions from "../components/CafeDetail/CafePromotions";
import CafeDetails from "./../components/CafeDetail/CafeDetails.tsx";
import CafeMenu from "./../components/CafeDetail/CafeMenu";
import CafeReviewSection from "../components/CafeDetail/CafeReviewSection";
import CafeSidebar from "./../components/CafeDetail/CafeSidebar";
import Button from "../components/common/Button";
import { FaUser } from "react-icons/fa";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";

// API base URL
const API_BASE_URL = "http://localhost/cafeind_api/api";

// ReCAPTCHA site key
const ReCAPTCHA_SITE_KEY = "6LfStDwrAAAAAMwl651B96VxGL6PlSaGdZiTZGNf";

// Define types for API response
interface Image {
  image_url: string;
  is_primary: number;
}

interface ApiCafe {
  id: string;
  name: string;
  address: string;
  area: string;
  description: string;
  imageUrl: string;
  priceRange: number;
  noiseLevel: "Quiet" | "Moderate" | "Loud";
  avgVisitLength: string;
  openingHours: {
    Weekdays: string;
    Weekends: string;
  };
  featured: boolean;
  menuLink: string | null;
  website: string | null;
  linkMaps: string | null;
  instagram: string | null;
  amenities: string[];
  tags: string[];
  reviews: UserReview[];
  images: string[];
  menu: MenuItem[];
  promo: Promo[];
  rating: number;
}

interface ApiCafeResponse {
  success: boolean;
  data: ApiCafe[];
  message?: string;
  metadata?: {
    areas: string[];
    amenities: string[];
  };
}

interface ApiImagesResponse {
  success: boolean;
  data: Image[];
  message?: string;
}

interface ApiMenuResponse {
  success: boolean;
  data: MenuItem[];
  message?: string;
}

interface ApiPromoResponse {
  success: boolean;
  data: Promo[];
  message?: string;
}

interface ApiReviewsResponse {
  success: boolean;
  data: UserReview[];
  message?: string;
}

interface ApiSubmitReviewResponse {
  success: boolean;
  message?: string;
  recaptcha_expired?: boolean;
  error_codes?: string[];
}

const CafeDetailPageUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userRatings, setUserRatings] = useState<{
    wifiQuality: number | null;
    powerOutlets: number | null;
    comfortLevel: number | null;
  }>({
    wifiQuality: null,
    powerOutlets: null,
    comfortLevel: null,
  });
  const [userReview, setUserReview] = useState<string>("");
  const [userName, setUserName] = useState<string>(""); // State for name
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false); // State for modal
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch cafe data
  useEffect(() => {
    const fetchCafeData = async () => {
      if (!id) {
        setError("Cafe ID is missing");
        setLoading(false);
        return;
      }

      setLoading(true);
      let fetchedCafe: Cafe | null = null;

      try {
        console.log(
          `Fetching cafe ${id} from API at ${new Date().toLocaleTimeString(
            "en-US",
            { timeZone: "Asia/Jakarta" }
          )} WIB...`
        );

        const cafeResponse = await fetch(
          `${API_BASE_URL}/get_cafes.php?cafe_id=${id}`
        );
        if (!cafeResponse.ok) {
          const errorText = await cafeResponse.text();
          throw new Error(
            `Cafes API error! status: ${cafeResponse.status}, response: ${errorText}`
          );
        }
        const cafeResult: ApiCafeResponse = await cafeResponse.json();
        console.log("Cafe API response:", cafeResult);

        if (!cafeResult.success)
          throw new Error(cafeResult.message || "Failed to fetch cafe data");
        const foundCafe = cafeResult.data[0];
        if (!foundCafe) throw new Error(`Cafe with ID ${id} not found`);

        fetchedCafe = {
          id: foundCafe.id,
          name: foundCafe.name,
          address: foundCafe.address,
          area: foundCafe.area,
          description: foundCafe.description,
          imageUrl: foundCafe.imageUrl,
          images: [], // Initialize as empty CafeImage array
          priceRange: foundCafe.priceRange,
          noiseLevel: foundCafe.noiseLevel,
          avgVisitLength: foundCafe.avgVisitLength,
          openingHours: foundCafe.openingHours,
          featured: foundCafe.featured,
          menuLink: foundCafe.menuLink,
          website: foundCafe.website,
          linkMaps: foundCafe.linkMaps,
          instagram: foundCafe.instagram,
          amenities: foundCafe.amenities,
          tags: foundCafe.tags,
          reviews: [],
          menu: [],
          promo: [],
          rating: foundCafe.rating,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error fetching cafe";
        setError(errorMessage);
        setLoading(false);
        return;
      }

      try {
        const imagesResponse = await fetch(
          `${API_BASE_URL}/get_cafe_images.php?cafe_id=${id}`
        );
        if (imagesResponse.ok) {
          const imagesResult: ApiImagesResponse = await imagesResponse.json();
          console.log("Images API response:", imagesResult);
          if (imagesResult.success) {
            fetchedCafe.images = imagesResult.data.map(
              (img: Image): CafeImage => ({
                image_url: img.image_url,
                is_primary: !!img.is_primary,
              })
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }

      try {
        const menuResponse = await fetch(
          `${API_BASE_URL}/get_menu_cafeId.php?cafe_id=${id}`
        );
        if (menuResponse.ok) {
          const menuResult: ApiMenuResponse = await menuResponse.json();
          console.log("Menu API response:", menuResult);
          if (menuResult.success) {
            fetchedCafe.menu = menuResult.data;
          }
        }
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }

      try {
        const promoResponse = await fetch(
          `${API_BASE_URL}/get_promotions.php?cafe_id=${id}`
        );
        if (promoResponse.ok) {
          const promoResult: ApiPromoResponse = await promoResponse.json();
          console.log("Promotions API response:", promoResult);
          if (promoResult.success) {
            fetchedCafe.promo = promoResult.data;
          }
        }
      } catch (err) {
        console.error("Failed to fetch promotions:", err);
      }

      try {
        const reviewsResponse = await fetch(
          `${API_BASE_URL}/get_reviews.php?cafe_id=${id}`
        );
        if (reviewsResponse.ok) {
          const reviewsResult: ApiReviewsResponse =
            await reviewsResponse.json();
          console.log("Reviews API response:", reviewsResult);
          if (reviewsResult.success) {
            fetchedCafe.reviews = reviewsResult.data;
          }
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }

      setCafe(fetchedCafe);
      console.log("Cafe set:", fetchedCafe);
      setLoading(false);
    };

    fetchCafeData();
  }, [id]);

  // GSAP animations
  useEffect(() => {
    if (!cafe) return;

    const tl = gsap.timeline();
    tl.fromTo(
      ".cafe-header",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
    tl.fromTo(
      ".cafe-image-container",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8 },
      "-=0.5"
    );
    tl.fromTo(
      ".cafe-details > *",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
      "-=0.5"
    );
    tl.fromTo(
      ".cafe-promotions",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4"
    );

    return () => {
      tl.kill();
    };
  }, [cafe]);

  // Promotion countdown timer
  useEffect(() => {
    if (cafe?.promo && cafe.promo.length > 0) {
      const expiryDate = new Date(cafe.promo[0].valid_until).getTime();
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const difference = expiryDate - now;

        if (difference <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }
  }, [cafe]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle invalid image URLs with a fallback
  const cafeImages: string[] =
    cafe?.images && cafe.images.length > 0
      ? cafe.images.map((img) => img.image_url)
      : cafe?.imageUrl
      ? [cafe.imageUrl]
      : [
          "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
        ];

  const canSubmitReview = () => {
    const lastSubmission = localStorage.getItem(
      `lastReview_${id}_${userName}`
    );
    if (lastSubmission) {
      const lastTime = new Date(lastSubmission).getTime();
      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      return now - lastTime > twentyFourHours;
    }
    return true;
  };

  const handleSubmitReview = async () => {
    setError(null);
    setSuccessMessage(null);

    if (
      !cafe ||
      userRatings.wifiQuality === null ||
      userRatings.powerOutlets === null ||
      userRatings.comfortLevel === null ||
      !userReview.trim() ||
      !userName.trim()
    ) {
      setError("Please fill in all fields (name, ratings, and comment).");
      return;
    }

    if (!canSubmitReview()) {
      setError("You can only submit one review per cafe every 24 hours.");
      return;
    }

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    setSubmitting(true);

    const newReview: UserReview = {
      wifiQuality: userRatings.wifiQuality,
      powerOutlets: userRatings.powerOutlets,
      comfortLevel: userRatings.comfortLevel,
      comment: userReview,
      date: new Date().toISOString(),
      user: userName,
    };

    try {
      console.log("Submitting review for cafe", id);

      const response = await fetch(`${API_BASE_URL}/submit_review.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cafeId: id,
          review: { ...newReview, name: userName },
          recaptchaToken,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Response: ${errorText}`
        );
      }

      const data: ApiSubmitReviewResponse = await response.json();
      console.log("Review submission response:", data);

      if (data.success) {
        const updatedReviews = cafe.reviews
          ? [...cafe.reviews, newReview]
          : [newReview];
        setCafe({ ...cafe, reviews: updatedReviews });
        localStorage.setItem(
          `lastReview_${id}_${userName}`,
          new Date().toISOString()
        );
        setUserRatings({
          wifiQuality: null,
          powerOutlets: null,
          comfortLevel: null,
        });
        setUserReview("");
        setUserName("");
        setRecaptchaToken(null);
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setSuccessMessage(
          "Review submitted successfully! Thank you for your feedback."
        );
        setIsReviewModalOpen(false);
      } else {
        if (
          data.recaptcha_expired ||
          data.error_codes?.includes("timeout-or-duplicate")
        ) {
          setError(
            "reCAPTCHA token has expired. Please complete the verification again."
          );
          if (recaptchaRef.current) recaptchaRef.current.reset();
          setRecaptchaToken(null);
        } else if (data.error_codes?.includes("invalid-input-response")) {
          setError(
            "Invalid reCAPTCHA token. Please complete the verification again."
          );
          if (recaptchaRef.current) recaptchaRef.current.reset();
          setRecaptchaToken(null);
        } else if (data.error_codes?.includes("missing-input-response")) {
          setError(
            "reCAPTCHA token is missing. Please complete the verification."
          );
          if (recaptchaRef.current) recaptchaRef.current.reset();
          setRecaptchaToken(null);
        } else {
          setError(data.message || "Failed to submit review.");
        }
        console.log("Review submission failed:", data.message);
      }
    } catch (error) {
      const errorMessage =
        "Error submitting review: " +
        (error instanceof Error ? error.message : "Unknown error");
      setError(errorMessage);
      console.error(errorMessage);
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setRecaptchaToken(null);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRatings =
    cafe?.reviews && cafe.reviews.length > 0
      ? {
          wifiQuality:
            cafe.reviews.reduce(
              (acc: number, review: UserReview) =>
                acc + (review.wifiQuality || 0),
              0
            ) / cafe.reviews.length,
          powerOutlets:
            cafe.reviews.reduce(
              (acc: number, review: UserReview) =>
                acc + (review.powerOutlets || 0),
              0
            ) / cafe.reviews.length,
          comfortLevel:
            cafe.reviews.reduce(
              (acc: number, review: UserReview) =>
                acc + (review.comfortLevel || 0),
              0
            ) / cafe.reviews.length,
        }
      : { wifiQuality: 0, powerOutlets: 0, comfortLevel: 0 };

  const averageRating =
    cafe?.reviews && cafe.reviews.length > 0
      ? (averageRatings.wifiQuality +
          averageRatings.powerOutlets +
          averageRatings.comfortLevel) /
        3
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Loading...
            </h2>
            <p className="text-gray-600">Fetching cafe details, please wait.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cafe || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Unable to Load Cafe
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              {error ||
                "We couldn't fetch the cafe details. Please try again later or contact support."}
            </p>
            <Link to="/cafes">
              <Button variant="primary">Browse All Cafes</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <CafeHeader
            name={cafe.name}
            address={cafe.address}
            area={cafe.area}
            averageRating={averageRating}
          />

          <CafeRatingSummary averageRatings={averageRatings} />

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CafeImageSlider
                images={cafeImages}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
                name={cafe.name}
              />

              <CafePromotions promos={cafe.promo} />

              <CafeDetails
                description={cafe.description}
                tags={cafe.tags}
                amenities={cafe.amenities}
              />

              <CafeMenu menu={cafe.menu} menuLink={cafe.menuLink} />

              <CafeReviewSection
                reviews={cafe.reviews}
                averageRating={averageRating}
                openReviewModal={() => setIsReviewModalOpen(true)}
              />
            </div>

            <div className="lg:col-span-1">
              <CafeSidebar
                priceRange={cafe.priceRange}
                noiseLevel={cafe.noiseLevel}
                avgVisitLength={cafe.avgVisitLength}
                openingHours={cafe.openingHours}
                website={cafe.website}
                linkMaps={cafe.linkMaps}
                instagram={cafe.instagram}
                promos={cafe.promo}
                timeLeft={timeLeft}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl transform animate-slideUp border border-blue-100 backdrop-blur-sm relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-blue-100 relative">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                  <svg
                    className="w-6 h-6 text-white relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent relative">
                    Submit Review
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent opacity-50"></div>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    Share your experience with us
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setError(null);
                  if (recaptchaRef.current) recaptchaRef.current.reset();
                  setRecaptchaToken(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-blue-50 p-2.5 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                <svg
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Name Input */}
            <div className="mb-5 relative">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                  <FaUser className="w-3 h-3 text-white" />
                </div>
                Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 hover:border-blue-300 bg-blue-50/30 focus:bg-white shadow-sm group-hover:shadow-md"
                  placeholder="Enter your name"
                  maxLength={100}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rating Sections */}
            <div className="grid grid-cols-3 gap-6 mb-5">
              {/* WiFi Quality */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300 hover:-translate-y-1 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl"></div>
                <label className="flex text-sm font-semibold text-gray-700 mb-3 items-center relative z-10">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-2 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                    <svg
                      className="w-4 h-4 text-blue-600 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      />
                    </svg>
                  </div>
                  WiFi Quality
                  <div className="ml-auto flex space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-3 bg-blue-300 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                      ></div>
                    ))}
                  </div>
                </label>
                <div className="flex items-center justify-center space-x-1 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setUserRatings({
                          ...userRatings,
                          wifiQuality: star,
                        })
                      }
                      className="group transition-all duration-200 hover:scale-110 focus:outline-none"
                    >
                      <svg
                        className={`w-6 h-6 transition-all duration-200 ${
                          star <= (userRatings.wifiQuality || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                        fill={
                          star <= (userRatings.wifiQuality || 0)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Power Outlets */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300 hover:-translate-y-1 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl"></div>
                <label className="flex text-sm font-semibold text-gray-700 mb-3 items-center relative z-10">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-2 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                    <svg
                      className="w-4 h-4 text-blue-600 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  Power Outlets
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-sm"></div>
                  </div>
                </label>
                <div className="flex items-center justify-center space-x-1 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setUserRatings({
                          ...userRatings,
                          powerOutlets: star,
                        })
                      }
                      className="group transition-all duration-200 hover:scale-110 focus:outline-none"
                    >
                      <svg
                        className={`w-6 h-6 transition-all duration-200 ${
                          star <= (userRatings.powerOutlets || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                        fill={
                          star <= (userRatings.powerOutlets || 0)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comfort Level */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300 hover:-translate-y-1 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl"></div>
                <label className="flex text-sm font-semibold text-gray-700 mb-3 items-center relative z-10">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-2 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                    <svg
                      className="w-4 h-4 text-blue-600 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  Comfort Level
                  <div className="ml-auto">
                    <div className="w-6 h-1 bg-gradient-to-r from-pink-300 to-blue-300 rounded-full"></div>
                  </div>
                </label>
                <div className="flex items-center justify-center space-x-1 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setUserRatings({
                          ...userRatings,
                          comfortLevel: star,
                        })
                      }
                      className="group transition-all duration-200 hover:scale-110 focus:outline-none"
                    >
                      <svg
                        className={`w-6 h-6 transition-all duration-200 ${
                          star <= (userRatings.comfortLevel || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                        fill={
                          star <= (userRatings.comfortLevel || 0)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <div className="mb-5 relative">
              <label className="flex text-sm font-semibold text-gray-700 mb-2 items-center">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                  <ChatBubbleLeftIcon className="w-3 h-3 text-white" />
                </div>
                Comment
                <div className="ml-2 flex space-x-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-xl scale-0 group-focus-within:scale-100 transition-transform duration-300"></div>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 resize-none bg-blue-50/30 focus:bg-white hover:border-blue-300 shadow-sm hover:shadow-md relative z-10"
                  rows={3}
                  placeholder="Share your experience... What did you love? What could be improved?"
                  maxLength={1000}
                ></textarea>
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100 z-20 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full"></div>
                  <span>{userReview.length}/1000</span>
                </div>
              </div>
            </div>

            {/* ReCAPTCHA */}
            <div className="mb-5 flex justify-center">
              <div className="transform hover:scale-105 transition-transform duration-200 p-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={ReCAPTCHA_SITE_KEY}
                    onChange={(token) => setRecaptchaToken(token)}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-xl animate-shake shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-100/30 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center relative z-10">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 shadow-sm relative">
                    <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-30"></div>
                    <svg
                      className="w-3 h-3 text-red-500 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-blue-100 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setError(null);
                  if (recaptchaRef.current) recaptchaRef.current.reset();
                  setRecaptchaToken(null);
                }}
                disabled={submitting}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 transform border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-sm relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 scale-0 group-hover:scale-100 transition-transform duration-200 rounded-xl"></div>
                <span className="relative z-10">Cancel</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitReview}
                disabled={submitting}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 transform flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-200 rounded-xl"></div>
                {submitting ? (
                  <div className="flex items-center relative z-10">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    <span>Submitting...</span>
                    <div className="ml-2 flex space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center relative z-10">
                    <svg
                      className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Submit Review
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CafeDetailPageUser;
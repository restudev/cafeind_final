// import React, { useState, useEffect } from "react";
// import { gsap } from "gsap";
// import { useSearchParams } from "react-router-dom";
// import Navbar from "../components/Layout/Navbar";
// import Footer from "../components/Layout/Footer";
// import CafeCard from "../components/Cafes/CafeCard";
// import CafeFilter from "../components/Cafes/CafeFilter";
// import { CafeFilter as CafeFilterType, Cafe } from "../types/cafe";
// import { initializeAnimations } from "../utils/animations";

// const CafeListingPage: React.FC = () => {
//   const [searchParams] = useSearchParams();

//   const initialFilter: CafeFilterType = {
//     search: searchParams.get("search") || "",
//     area: "",
//     minRating: 0,
//     priceRange: [1, 2, 3],
//     amenities: [],
//     openNow: false,
//   };

//   const [filter, setFilter] = useState<CafeFilterType>(initialFilter);
//   const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
//   const [allCafes, setAllCafes] = useState<Cafe[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCafes = async () => {
//       try {
//         const response = await fetch(
//           "https://cafeind.my.id/cafeind_api/api/get_cafes.php"
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         if (result.success) {
//           setAllCafes(result.data);
//           setFilteredCafes(result.data);
//         } else {
//           setError(result.message || "Failed to fetch cafes");
//         }
//       } catch (err) {
//         setError(
//           "Error fetching cafes: " +
//             (err instanceof Error ? err.message : "Unknown error")
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCafes();
//   }, []);

//   useEffect(() => {
//     initializeAnimations();
//     const title = document.querySelector(".page-title");
//     if (title) {
//       gsap.fromTo(
//         title,
//         { opacity: 0, y: 30 },
//         { opacity: 1, y: 0, duration: 0.8 }
//       );
//     }
//     applyFilters();

//     return () => {
//       gsap.killTweensOf(".page-title");
//     };
//   }, [allCafes]);

//   useEffect(() => {
//     const searchQuery = searchParams.get("search");
//     if (searchQuery) {
//       setFilter((prev) => ({ ...prev, search: searchQuery }));
//       applyFilters(searchQuery);
//     }
//   }, [searchParams]);

//   const applyFilters = (searchOverride?: string) => {
//     const searchTerm =
//       searchOverride !== undefined ? searchOverride : filter.search;

//     let filtered = allCafes.filter((cafe) => {
//       const searchMatch =
//         searchTerm === "" ||
//         cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cafe.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cafe.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         cafe.description.toLowerCase().includes(searchTerm.toLowerCase());

//       const areaMatch = filter.area === "" || cafe.area === filter.area;

//       const averageRatings =
//         cafe.reviews && cafe.reviews.length > 0
//           ? {
//               wifiQuality:
//                 cafe.reviews.reduce(
//                   (acc, review) => acc + review.wifiQuality,
//                   0
//                 ) / cafe.reviews.length,
//               powerOutlets:
//                 cafe.reviews.reduce(
//                   (acc, review) => acc + review.powerOutlets,
//                   0
//                 ) / cafe.reviews.length,
//               comfortLevel:
//                 cafe.reviews.reduce(
//                   (acc, review) => acc + review.comfortLevel,
//                   0
//                 ) / cafe.reviews.length,
//             }
//           : { wifiQuality: 0, powerOutlets: 0, comfortLevel: 0 };

//       const averageRating =
//         cafe.reviews && cafe.reviews.length > 0
//           ? (averageRatings.wifiQuality +
//               averageRatings.powerOutlets +
//               averageRatings.comfortLevel) /
//             3
//           : 0;
//       const ratingMatch = averageRating >= filter.minRating;

//       const priceMatch = filter.priceRange.includes(cafe.priceRange);

//       const amenitiesMatch =
//         filter.amenities.length === 0 ||
//         filter.amenities.every((amenity) => cafe.amenities.includes(amenity));

//       return (
//         searchMatch && areaMatch && ratingMatch && priceMatch && amenitiesMatch
//       );
//     });

//     // Apply openNow filter if enabled
//     if (filter.openNow) {
//       const isCafeOpen = (cafe: Cafe) => {
//         const now = new Date("2025-05-19T03:05:00+07:00"); // Current time: 03:05 AM WIB
//         const day = now.getDay();
//         const hours = now.getHours();
//         const minutes = now.getMinutes();
//         const currentTimeInMinutes = hours * 60 + minutes;

//         const isWeekend = day === 0 || day === 6;
//         const hoursKey = isWeekend ? "Weekends" : "Weekdays";
//         const openingHours = cafe.openingHours || { Weekdays: "", Weekends: "" };

//         if (openingHours[hoursKey] === "24 Hour") {
//           return true;
//         }

//         const [opening, closing] = (openingHours[hoursKey] || "").split(" - ");
//         if (!opening || !closing) return false;

//         const parseTime = (time: string) => {
//           const [hourStr, period] = time.split(" ");
//           const [hours, minutes] = hourStr.split(":").map(Number);
//           const isPM = period.includes("PM");
//           let adjustedHours = hours;
//           if (isPM && hours !== 12) adjustedHours += 12;
//           if (!isPM && hours === 12) adjustedHours = 0;
//           return adjustedHours * 60 + (minutes || 0);
//         };

//         const openingTime = parseTime(opening);
//         let closingTime = parseTime(closing);

//         if (closingTime <= openingTime) {
//           closingTime += 24 * 60; // Handle midnight crossover
//         }

//         return (
//           currentTimeInMinutes >= openingTime && currentTimeInMinutes <= closingTime
//         );
//       };

//       filtered = filtered.filter(isCafeOpen);
//     }

//     setFilteredCafes(filtered);

//     const countElement = document.querySelector(".cafe-count");
//     if (countElement) {
//       gsap.fromTo(
//         countElement,
//         { opacity: 0, y: 10 },
//         { opacity: 1, y: 0, duration: 0.5 }
//       );
//     }

//     const cardWrappers = document.querySelectorAll(".cafe-card-wrapper");
//     if (cardWrappers.length > 0) {
//       gsap.fromTo(
//         cardWrappers,
//         { opacity: 0, y: 20 },
//         {
//           opacity: 1,
//           y: 0,
//           stagger: 0.1,
//           duration: 0.5,
//           ease: "power2.out",
//         }
//       );
//     }
//   };

//   const resetFilters = () => {
//     setFilter(initialFilter);
//     setFilteredCafes(allCafes);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-grow pt-24 pb-16">
//           <div className="container mx-auto px-4 text-center py-10">
//             Loading...
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navbar />
//         <main className="flex-grow pt-24 pb-16">
//           <div className="container mx-auto px-4 text-center py-10 text-red-500">
//             {error}
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow pt-24 pb-16">
//         <div className="container mx-auto px-4">
//           <h1 className="page-title text-3xl font-bold text-blue-900 mb-6">
//             {filter.search
//               ? `Search Results for "${filter.search}"`
//               : "Find Your Perfect Work Cafe"}
//           </h1>
//           <CafeFilter
//             filter={filter}
//             setFilter={setFilter}
//             applyFilters={() => applyFilters()}
//             resetFilters={resetFilters}
//             allCafes={allCafes}
//           />
//           <div className="cafe-count text-gray-600 mb-6">
//             Showing {filteredCafes.length}{" "}
//             {filteredCafes.length === 1 ? "cafe" : "cafes"}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredCafes.map((cafe, index) => (
//               <CafeCard key={cafe.id} cafe={cafe} index={index} />
//             ))}
//           </div>
//           {filteredCafes.length === 0 && (
//             <div className="text-center py-12">
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                 No cafes found
//               </h3>
//               <p className="text-gray-600">
//                 {filter.search
//                   ? `No cafes match your search for "${filter.search}". Try a different search term or adjust your filters.`
//                   : "No cafes match your filters. Try adjusting your filters to find more cafes."}
//               </p>
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default CafeListingPage;

import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import CafeCard from "../components/Cafes/CafeCard";
import CafeFilter from "../components/Cafes/CafeFilter";
import { CafeFilter as CafeFilterType, Cafe } from "../types/cafe";
import { initializeAnimations } from "../utils/animations";

const CafeListingPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const initialFilter: CafeFilterType = {
    search: searchParams.get("search") || "",
    area: "",
    minRating: 0,
    priceRange: [1, 2, 3],
    amenities: [],
    openNow: false,
  };

  const [filter, setFilter] = useState<CafeFilterType>(initialFilter);
  const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
  const [allCafes, setAllCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const cafesPerPage = 6;

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await fetch(
          "https://cafeind.my.id/cafeind_api/api/get_cafes.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setAllCafes(result.data);
          setFilteredCafes(result.data);
        } else {
          setError(result.message || "Failed to fetch cafes");
        }
      } catch (err) {
        setError(
          "Error fetching cafes: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []);

  useEffect(() => {
    initializeAnimations();
    const title = document.querySelector(".page-title");
    if (title) {
      gsap.fromTo(
        title,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    }
    applyFilters();

    return () => {
      gsap.killTweensOf(".page-title");
    };
  }, [allCafes]);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setFilter((prev) => ({ ...prev, search: searchQuery }));
      applyFilters(searchQuery);
    }
  }, [searchParams]);

  const applyFilters = (searchOverride?: string) => {
    const searchTerm =
      searchOverride !== undefined ? searchOverride : filter.search;

    let filtered = allCafes.filter((cafe) => {
      const searchMatch =
        searchTerm === "" ||
        cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.description.toLowerCase().includes(searchTerm.toLowerCase());

      const areaMatch = filter.area === "" || cafe.area === filter.area;

      const averageRatings =
        cafe.reviews && cafe.reviews.length > 0
          ? {
              wifiQuality:
                cafe.reviews.reduce(
                  (acc, review) => acc + review.wifiQuality,
                  0
                ) / cafe.reviews.length,
              powerOutlets:
                cafe.reviews.reduce(
                  (acc, review) => acc + review.powerOutlets,
                  0
                ) / cafe.reviews.length,
              comfortLevel:
                cafe.reviews.reduce(
                  (acc, review) => acc + review.comfortLevel,
                  0
                ) / cafe.reviews.length,
            }
          : { wifiQuality: 0, powerOutlets: 0, comfortLevel: 0 };

      const averageRating =
        cafe.reviews && cafe.reviews.length > 0
          ? (averageRatings.wifiQuality +
              averageRatings.powerOutlets +
              averageRatings.comfortLevel) /
            3
          : 0;
      const ratingMatch = averageRating >= filter.minRating;

      const priceMatch = filter.priceRange.includes(cafe.priceRange);

      const amenitiesMatch =
        filter.amenities.length === 0 ||
        filter.amenities.every((amenity) => cafe.amenities.includes(amenity));

      return (
        searchMatch && areaMatch && ratingMatch && priceMatch && amenitiesMatch
      );
    });

    // Apply openNow filter if enabled
    if (filter.openNow) {
      const isCafeOpen = (cafe: Cafe) => {
        const now = new Date("2025-05-19T03:05:00+07:00"); // Current time: 03:05 AM WIB
        const day = now.getDay();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTimeInMinutes = hours * 60 + minutes;

        const isWeekend = day === 0 || day === 6;
        const hoursKey = isWeekend ? "Weekends" : "Weekdays";
        const openingHours = cafe.openingHours || { Weekdays: "", Weekends: "" };

        if (openingHours[hoursKey] === "24 Hour") {
          return true;
        }

        const [opening, closing] = (openingHours[hoursKey] || "").split(" - ");
        if (!opening || !closing) return false;

        const parseTime = (time: string) => {
          const [hourStr, period] = time.split(" ");
          const [hours, minutes] = hourStr.split(":").map(Number);
          const isPM = period.includes("PM");
          let adjustedHours = hours;
          if (isPM && hours !== 12) adjustedHours += 12;
          if (!isPM && hours === 12) adjustedHours = 0;
          return adjustedHours * 60 + (minutes || 0);
        };

        const openingTime = parseTime(opening);
        let closingTime = parseTime(closing);

        if (closingTime <= openingTime) {
          closingTime += 24 * 60; // Handle midnight crossover
        }

        return (
          currentTimeInMinutes >= openingTime && currentTimeInMinutes <= closingTime
        );
      };

      filtered = filtered.filter(isCafeOpen);
    }

    setFilteredCafes(filtered);
    // Reset ke halaman pertama ketika filter berubah
    setCurrentPage(1);

    const countElement = document.querySelector(".cafe-count");
    if (countElement) {
      gsap.fromTo(
        countElement,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }

    const cardWrappers = document.querySelectorAll(".cafe-card-wrapper");
    if (cardWrappers.length > 0) {
      gsap.fromTo(
        cardWrappers,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  };

  const resetFilters = () => {
    setFilter(initialFilter);
    setFilteredCafes(allCafes);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCafes.length / cafesPerPage);
  const startIndex = (currentPage - 1) * cafesPerPage;
  const endIndex = startIndex + cafesPerPage;
  const currentCafes = filteredCafes.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 3;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-12 mb-8">
        {/* Container with glass effect */}
        <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-2 py-2 shadow-lg border border-gray-200/50">
          {/* Previous button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full transition-all duration-200 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page numbers container */}
          <div className="flex items-center mx-2">
            {/* First page if not visible */}
            {startPage > 1 && (
              <div className="flex items-center">
                <button
                  onClick={() => goToPage(1)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95"
                >
                  1
                </button>
                {startPage > 2 && (
                  <span className="px-2 text-gray-400 text-sm">•••</span>
                )}
              </div>
            )}

            {/* Visible page numbers */}
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 ${
                  currentPage === page
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/25"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last page if not visible */}
            {endPage < totalPages && (
              <div className="flex items-center">
                {endPage < totalPages - 1 && (
                  <span className="px-2 text-gray-400 text-sm">•••</span>
                )}
                <button
                  onClick={() => goToPage(totalPages)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95"
                >
                  {totalPages}
                </button>
              </div>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full transition-all duration-200 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Page info */}
        <div className="ml-6 text-sm text-gray-500 hidden sm:block">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-10">
            Loading...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-10 text-red-500">
            {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="page-title text-3xl font-bold text-blue-900 mb-6">
            {filter.search
              ? `Search Results for "${filter.search}"`
              : "Find Your Perfect Work Cafe"}
          </h1>
          <CafeFilter
            filter={filter}
            setFilter={setFilter}
            applyFilters={() => applyFilters()}
            resetFilters={resetFilters}
            allCafes={allCafes}
          />
          <div className="flex justify-between items-center cafe-count text-gray-600 mb-6">
            <div>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredCafes.length)} of {filteredCafes.length}{" "}
              {filteredCafes.length === 1 ? "cafe" : "cafes"}
            </div>
            {totalPages > 1 && (
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Jump to:</span>
                <select
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <option key={page} value={page}>
                      Page {page}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCafes.map((cafe, index) => (
              <CafeCard key={cafe.id} cafe={cafe} index={index} />
            ))}
          </div>
          
          {/* Pagination Component */}
          <Pagination />
          
          {filteredCafes.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No cafes found
              </h3>
              <p className="text-gray-600">
                {filter.search
                  ? `No cafes match your search for "${filter.search}". Try a different search term or adjust your filters.`
                  : "No cafes match your filters. Try adjusting your filters to find more cafes."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CafeListingPage;
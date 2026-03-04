import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Star,
  Trash2,
  Eye,
  User,
  Coffee,
  MessageSquare,
  Filter,
  CheckCircle,
  AlertCircle,
  Loader2,
  MoreVertical,
  MapPin,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import AdminLayout from "../../components/Admin/Layout/AdminLayout";

// API Configuration
const API_BASE_URL = "http://localhost/cafeind_api/api/reviews";

// Types
interface Review {
  id: number;
  cafe_id: number;
  cafe_name?: string;
  wifi_quality: number;
  power_outlets: number;
  comfort_level: number;
  comment?: string;
  date: string;
  user?: string;
  phone_number?: string;
  overall_rating: number;
}

interface RawReview {
  id: number;
  cafe_id: number;
  cafe_name?: string;
  wifi_quality: number;
  power_outlets: number;
  comfort_level: number;
  comment?: string;
  date: string;
  user?: string;
  phone_number?: string;
  overall_rating: number;
}

interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  reviews_this_month: number;
  top_rated_cafe: string;
}

interface ApiResponse {
  success: boolean;
  data?: RawReview[];
  stats?: ReviewStats;
  message?: string;
}

const ReviewManagement: React.FC = () => {
  // State Management
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [cafeFilter, setCafeFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Clear messages after timeout
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch Reviews
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/get_all_reviews.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        setReviews(result.data || []);
        setStats(result.stats || null);
      } else {
        throw new Error(result.message || "Failed to fetch reviews");
      }
    } catch (error) {
      let errorMessage = "Error fetching reviews: ";
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage +=
          "Unable to connect to the server. Please check if the backend is running.";
      } else {
        errorMessage += (error as Error).message;
      }
      setError(errorMessage);
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and Sort Reviews
  const filterAndSortReviews = useCallback(() => {
    let filtered = [...reviews];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (review) =>
          review.cafe_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.user?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== null) {
      filtered = filtered.filter(
        (review) => Math.floor(review.overall_rating) === ratingFilter
      );
    }

    // Cafe filter
    if (cafeFilter) {
      filtered = filtered.filter((review) =>
        review.cafe_name?.toLowerCase().includes(cafeFilter.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest_rating":
          return b.overall_rating - a.overall_rating;
        case "lowest_rating":
          return a.overall_rating - b.overall_rating;
        case "cafe_name":
          return (a.cafe_name || "").localeCompare(b.cafe_name || "");
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, ratingFilter, cafeFilter, sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    filterAndSortReviews();
  }, [filterAndSortReviews]);

  // Delete Review
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    setDeleting(reviewToDelete.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/delete_review.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review_id: reviewToDelete.id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete review");
      }

      setSuccess(`Review deleted successfully!`);
      await fetchReviews();
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (error) {
      const errorMessage = `Error deleting review: ${(error as Error).message}`;
      setError(errorMessage);
      console.error("Error deleting review:", error);
    } finally {
      setDeleting(null);
    }
  };

  // Helper Functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRatingBgColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const openDetailModal = (review: Review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const openDeleteModal = (review: Review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRatingFilter(null);
    setCafeFilter("");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading reviews...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-24 translate-x-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-16 -translate-x-16"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Review Management</h1>
                    <p className="text-white/80 text-sm">
                      Monitor and manage user feedback
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white backdrop-blur-sm rounded-lg p-3 border border-white/30 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-md">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Total Reviews</p>
                        <p className="text-lg font-bold text-gray-900">{stats.total_reviews}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white backdrop-blur-sm rounded-lg p-3 border border-white/30 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-md">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Avg Rating</p>
                        <p className="text-lg font-bold text-gray-900">
                          {stats.average_rating.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white backdrop-blur-sm rounded-lg p-3 border border-white/30 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-md">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">This Month</p>
                        <p className="text-lg font-bold text-gray-900">{stats.reviews_this_month}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white backdrop-blur-sm rounded-lg p-3 border border-white/30 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-md">
                        <Coffee className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Top Rated</p>
                        <p className="text-xs font-semibold truncate text-gray-900">
                          {stats.top_rated_cafe}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <span className="text-green-800 dark:text-green-300">
                {success}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-800 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters & Search
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-600 ml-4"></div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Reviews
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by cafe, comment, or user..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <select
                value={ratingFilter !== null ? ratingFilter : ""}
                onChange={(e) =>
                  setRatingFilter(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Cafe Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cafe
              </label>
              <input
                type="text"
                value={cafeFilter}
                onChange={(e) => setCafeFilter(e.target.value)}
                placeholder="Filter by cafe..."
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest_rating">Highest Rating</option>
                <option value="lowest_rating">Lowest Rating</option>
                <option value="cafe_name">Cafe Name</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm ||
            ratingFilter !== null ||
            cafeFilter ||
            sortBy !== "newest") && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Active filters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {ratingFilter !== null && (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs">
                      Rating: {ratingFilter} stars
                    </span>
                  )}
                  {cafeFilter && (
                    <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                      Cafe: "{cafeFilter}"
                    </span>
                  )}
                  {sortBy !== "newest" && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                      Sort: {sortBy.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Reviews ({filteredReviews.length})
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm">
                Showing {filteredReviews.length} of {reviews.length} reviews
              </div>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {reviews.length === 0
                  ? "No reviews have been submitted yet."
                  : "Try adjusting your filters to see more reviews."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-gray-700/30 dark:hover:to-gray-600/30 transition-all duration-200 group relative"
                >
                  <div className="absolute left-2 top-4 w-1 h-12 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                  <div className="flex items-start justify-between pl-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full flex items-center justify-center shadow-sm">
                              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 opacity-80"></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {review.user || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <MapPin className="h-3 w-3 text-blue-500" />
                              <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                {review.cafe_name || "Unknown Cafe"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Overall Rating with enhanced styling */}
                          <div
                            className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${getRatingBgColor(
                              review.overall_rating
                            )} transform hover:scale-105 transition-transform duration-150`}
                          >
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current drop-shadow-sm" />
                              {review.overall_rating.toFixed(1)}
                            </div>
                          </div>

                          {/* Date with enhanced styling */}
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                            <Clock className="h-3 w-3" />
                            {formatDate(review.date)}
                          </div>
                        </div>
                      </div>

                      {/* Rating Breakdown with enhanced cards */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg p-2 border border-gray-200/50 dark:border-gray-600/50">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                            WiFi
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 transition-colors ${
                                  i < review.wifi_quality
                                    ? "text-yellow-400 fill-current drop-shadow-sm"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg p-2 border border-gray-200/50 dark:border-gray-600/50">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                            Power
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 transition-colors ${
                                  i < review.power_outlets
                                    ? "text-yellow-400 fill-current drop-shadow-sm"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg p-2 border border-gray-200/50 dark:border-gray-600/50">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                            Comfort
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 transition-colors ${
                                  i < review.comfort_level
                                    ? "text-yellow-400 fill-current drop-shadow-sm"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Comment with better styling */}
                      <div className="bg-gray-50/50 dark:bg-gray-700/20 rounded-lg p-3 border-l-4 border-blue-200 dark:border-blue-700">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          "{review.comment || "No comment provided"}"
                        </p>
                      </div>
                    </div>

                    {/* Actions with enhanced styling */}
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => openDetailModal(review)}
                        className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-150 hover:shadow-sm hover:scale-105 group/btn"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(review)}
                        disabled={deleting === review.id}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-150 disabled:opacity-50 hover:shadow-sm hover:scale-105 group/btn"
                        title="Delete Review"
                      >
                        {deleting === review.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Review Details
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <MoreVertical className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Review Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedReview.user || "Anonymous"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedReview.cafe_name || "Unknown Cafe"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(selectedReview.date)}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-lg font-bold ${getRatingBgColor(
                      selectedReview.overall_rating
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-current" />
                      {selectedReview.overall_rating.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Detailed Ratings */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      WiFi Quality
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < selectedReview.wifi_quality
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedReview.wifi_quality}/5
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Power Outlets
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < selectedReview.power_outlets
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedReview.power_outlets}/5
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Comfort Level
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < selectedReview.comfort_level
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedReview.comfort_level}/5
                    </p>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Review Comment
                  </h5>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedReview.comment || "No comment provided"}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Review ID
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      #{selectedReview.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Cafe ID</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      #{selectedReview.cafe_id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openDeleteModal(selectedReview);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && reviewToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-4">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete Review
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this review from{" "}
                  <span className="font-semibold">{reviewToDelete.user || "Anonymous"}</span>{" "}
                  for{" "}
                  <span className="font-semibold">
                    {reviewToDelete.cafe_name || "Unknown Cafe"}
                  </span>
                  ?
                </p>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting === reviewToDelete.id}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteReview}
                    disabled={deleting === reviewToDelete.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {deleting === reviewToDelete.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReviewManagement;
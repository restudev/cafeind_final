import React, { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Check,
  X,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Building2,
  Star,
  Trash2,
} from "lucide-react";
import AdminLayout from "../../components/Admin/Layout/AdminLayout";
import { CafeRequest, API_BASE_URL } from "../../types/cafeRequest";

const CafeRequests: React.FC = () => {
  const [requests, setRequests] = useState<CafeRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CafeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CafeRequest | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<CafeRequest | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Clear messages after 5 seconds
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

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const url = `${API_BASE_URL}/get_cafe_requests.php`;
      console.log("Fetching from:", url); // Debug URL
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Received data:", result); // Debug response

      if (result.success) {
        setRequests(result.data || []);
      } else {
        throw new Error(result.message || "Failed to fetch cafe requests");
      }
    } catch (error) {
      let errorMessage = "Error fetching cafe requests: ";
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage +=
          "Unable to connect to the server. Please check if the backend is running and the API URL is correct.";
      } else {
        errorMessage += (error as Error).message;
      }
      setError(errorMessage);
      console.error("Error fetching cafe requests:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterAndSortRequests = useCallback(() => {
    let filtered = [...requests];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (request) =>
          request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false ||
          request.submitter_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          false ||
          request.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.submitted_at).getTime() -
            new Date(a.submitted_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.submitted_at).getTime() -
            new Date(b.submitted_at).getTime()
          );
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

    console.log("Filtered requests:", filtered); // Debug filtered results
    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    filterAndSortRequests();
  }, [filterAndSortRequests]);

  const handleRequestAction = async (
    requestId: number,
    action: "approve" | "reject"
  ) => {
    if (!selectedRequest) return;

    setProcessing(requestId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/process_cafe_request.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_id: requestId,
          action,
          admin_notes: adminNotes.trim() || null,
          reviewed_by: "Admin",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to ${action} request`);
      }

      setSuccess(`Request ${action}d successfully!`);
      await fetchRequests();
      setShowModal(false);
      setSelectedRequest(null);
      setAdminNotes("");
    } catch (error) {
      const errorMessage = `Error ${action}ing request: ${
        (error as Error).message
      }`;
      setError(errorMessage);
      console.error(`Error ${action}ing request:`, error);
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;

    setDeleting(requestToDelete.id!);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/delete_cafe_request.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_id: requestToDelete.id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete request");
      }

      setSuccess(`Request "${requestToDelete.name}" deleted successfully!`);
      await fetchRequests();
      setShowDeleteModal(false);
      setRequestToDelete(null);
    } catch (error) {
      const errorMessage = `Error deleting request: ${
        (error as Error).message
      }`;
      setError(errorMessage);
      console.error("Error deleting request:", error);
    } finally {
      setDeleting(null);
    }
  };

  const openModal = (request: CafeRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || "");
    setShowModal(true);
  };

  const openDeleteModal = (request: CafeRequest) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriceRangeText = (range: number) => {
    switch (range) {
      case 1:
        return "Budget-friendly";
      case 2:
        return "Moderate";
      case 3:
        return "Premium";
      default:
        return "Budget-friendly";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading cafe requests...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Cafe Requests
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Review and manage cafe recommendations from users
                </p>
              </div>

              {/* Stats Cards */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2.5 rounded-lg border border-amber-200 dark:border-amber-800 transition-all hover:shadow-sm">
                  <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Pending
                  </span>
                  <span className="text-sm font-bold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full min-w-[24px] text-center">
                    {requests.filter((r) => r.status === "pending").length}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-all hover:shadow-sm">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Approved
                  </span>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full min-w-[24px] text-center">
                    {requests.filter((r) => r.status === "approved").length}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-800 transition-all hover:shadow-sm">
                  <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Rejected
                  </span>
                  <span className="text-sm font-bold text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full min-w-[24px] text-center">
                    {requests.filter((r) => r.status === "rejected").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Requests:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {requests.length}
                  </span>
                </span>
                {requests.length > 0 && (
                  <span className="text-gray-600 dark:text-gray-400">
                    Approval Rate:{" "}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {Math.round(
                        (requests.filter((r) => r.status === "approved")
                          .length /
                          requests.length) *
                          100
                      )}
                      %
                    </span>
                  </span>
                )}
              </div>
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
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden">
  {/* Background decoration */}
  <div className="absolute top-0 right-0 w-40 h-20 bg-gradient-to-br from-blue-500/3 to-indigo-500/3 rounded-full blur-xl"></div>
  
  <div className="relative z-10">
    {/* Filter Header */}
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg">
        <Search className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-600 ml-4"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Search
        </label>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search requests..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sort Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort By
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Cafe Name</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex flex-col justify-end">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {filteredRequests.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              of {requests.length} requests
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Active Filters Indicator */}
    {(searchTerm || statusFilter !== 'all' || sortBy !== 'newest') && (
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                Search: "{searchTerm}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full text-xs">
                Status: {statusFilter}
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                Sort: {sortBy === 'oldest' ? 'Oldest First' : sortBy === 'name' ? 'Cafe Name' : sortBy}
              </span>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</div>

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No cafe requests found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {requests.length === 0
                  ? "No cafe recommendations have been submitted yet."
                  : "Try adjusting your filters to see more requests."}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
              >
                {/* Header with Title and Status */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-4">
                    {request.name}
                  </h3>
                  {getStatusBadge(request.status)}
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {request.area}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-green-500" />
                    {formatDate(request.submitted_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500" />
                    {getPriceRangeText(request.price_range)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {request.description}
                </p>

                {/* Contact Info and Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Contact Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 min-w-0">
                    <span className="flex items-center gap-1.5 truncate">
                      <User className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{request.submitter_name}</span>
                    </span>
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">
                        {request.submitter_email}
                      </span>
                    </span>
                    {request.submitter_phone && (
                      <span className="flex items-center gap-1.5 truncate">
                        <Phone className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="truncate">
                          {request.submitter_phone}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openModal(request)}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      Review
                    </button>
                    <button
                      onClick={() => openDeleteModal(request)}
                      disabled={deleting === request.id}
                      className="inline-flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                    >
                      {deleting === request.id ? (
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1.5" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Delete Confirmation Modal */}
        {showDeleteModal && requestToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete Cafe Request
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete the request for "
                  {requestToDelete.name}"? This will permanently remove all
                  associated data.
                </p>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting === requestToDelete.id}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteRequest}
                    disabled={deleting === requestToDelete.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {deleting === requestToDelete.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Review Cafe Request
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Cafe Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Name
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedRequest.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Address
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedRequest.address}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Area
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedRequest.area}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Price Range
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {getPriceRangeText(selectedRequest.price_range)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Noise Level
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedRequest.noise_level}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Average Visit Length
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedRequest.avg_visit_length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Submitter Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Name
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedRequest.submitter_name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedRequest.submitter_email}
                        </p>
                      </div>
                      {selectedRequest.submitter_phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Phone
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {selectedRequest.submitter_phone}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Submitted
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {formatDate(selectedRequest.submitted_at)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </label>
                        <div className="mt-1">
                          {getStatusBadge(selectedRequest.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    {selectedRequest.description}
                  </p>
                </div>

                {/* Opening Hours */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Opening Hours
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Weekdays
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedRequest.opening_hours.Weekdays}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Weekends
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedRequest.opening_hours.Weekends}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {selectedRequest.amenities.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Amenities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedRequest.tags.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images */}
                {selectedRequest.image_urls.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Images
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedRequest.image_urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Cafe image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedRequest.additional_notes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Additional Notes
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {selectedRequest.additional_notes}
                    </p>
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Add notes about your decision..."
                  />
                </div>

                {/* Action Buttons */}
                {selectedRequest.status === "pending" && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() =>
                        handleRequestAction(selectedRequest.id!, "reject")
                      }
                      disabled={processing === selectedRequest.id}
                      className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {processing === selectedRequest.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        handleRequestAction(selectedRequest.id!, "approve")
                      }
                      disabled={processing === selectedRequest.id}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {processing === selectedRequest.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CafeRequests;

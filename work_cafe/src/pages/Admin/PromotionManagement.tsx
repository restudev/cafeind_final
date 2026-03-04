import React, { useState, useEffect, useCallback } from "react";
import {
  Tag,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Calendar,
  ChevronDown,
  X,
  Filter,
  Clock,
  Coffee,
  Wifi,
  AlertTriangle,
} from "lucide-react";
import AdminLayout from "../../components/Admin/Layout/AdminLayout";
import { formatDisplayDate } from "../../utils/dateUtils";
import { API_BASE_URL, Promotion } from "../../types/cafe";
import AddPromotionModal from "./AddPromotionModal";
import EditPromotionModal from "./EditPromotionModal";

// Define type for raw promotion data from API
interface RawPromotion {
  id: string | number;
  title: string;
  description: string;
  start_date: string;
  valid_until: string;
  icon?: string;
}

const PromotionManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [expandedPromo, setExpandedPromo] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    activeOnly: false,
    cafeId: "",
  });
  const [cafes, setCafes] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );

  const applyFilters = useCallback(
    (promos: Promotion[]) => {
      let filtered = [...promos];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (promo) =>
            promo.title.toLowerCase().includes(query) ||
            promo.description.toLowerCase().includes(query) ||
            promo.cafeName.toLowerCase().includes(query)
        );
      }

      if (filters.cafeId) {
        filtered = filtered.filter((promo) => promo.cafeId === filters.cafeId);
      }

      if (filters.activeOnly) {
        const today = new Date();
        filtered = filtered.filter((promo) => {
          if (!promo.valid_until) return true;
          try {
            const expiryDate = new Date(promo.valid_until);
            return expiryDate >= today;
          } catch {
            return true;
          }
        });
      }

      filtered = filtered.sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "cafeName":
            comparison = a.cafeName.localeCompare(b.cafeName);
            break;
          case "valid_until":
            if (!a.valid_until) return sortDirection === "asc" ? 1 : -1;
            if (!b.valid_until) return sortDirection === "asc" ? -1 : 1;
            try {
              const dateA = new Date(a.valid_until);
              const dateB = new Date(b.valid_until);
              comparison = dateA.getTime() - dateB.getTime();
            } catch {
              comparison = a.valid_until.localeCompare(b.valid_until);
            }
            break;
          default:
            comparison = 0;
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });

      setFilteredPromotions(filtered);
      setCurrentPage(1);
    },
    [searchQuery, filters, sortField, sortDirection]
  );

  const fetchCafes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_cafes.php`);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setCafes(result.data);
      } else {
        setError("Failed to fetch cafes");
      }
    } catch (error) {
      setError("Error fetching cafes");
      console.error("Fetch Error:", error);
    }
  }, []);

  const fetchPromotions = useCallback(async () => {
    if (cafes.length === 0) {
      setPromotions([]);
      applyFilters([]);
      return;
    }

    setLoading(true);
    try {
      const allPromotions: Promotion[] = [];
      for (const cafe of cafes) {
        const response = await fetch(
          `${API_BASE_URL}/get_promotions.php?cafe_id=${cafe.id}`
        );
        if (!response.ok) {
          continue;
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const cafePromos = result.data.map((promo: RawPromotion) => ({
            id: Number(promo.id),
            cafeId: String(cafe.id),
            cafeName: cafe.name,
            title: promo.title,
            description: promo.description,
            start_date: promo.start_date,
            valid_until: promo.valid_until,
            icon: promo.icon || "coffee",
          }));
          allPromotions.push(...cafePromos);
        }
      }
      setPromotions(allPromotions);
      applyFilters(allPromotions);
      setError(null);
    } catch (error) {
      setError("Error fetching promotions");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [cafes, applyFilters]);

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    applyFilters(promotions);
  }, [applyFilters, promotions]);

  const handleSort = useCallback(
    (field: string) => {
      if (field === sortField) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  const togglePromoExpansion = useCallback(
    (promoId: number) => {
      setExpandedPromo(expandedPromo === promoId ? null : promoId);
    },
    [expandedPromo]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      activeOnly: false,
      cafeId: "",
    });
    setSearchQuery("");
  }, []);

  const handleAddPromotion = () => {
    setShowAddModal(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setShowEditModal(true);
  };

  const handleDeletePromotion = async (promoId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/delete_promotion.php/${promoId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        await fetchPromotions();
        setShowDeleteConfirm(null);
      } else {
        setError(result.message || "Failed to delete promotion");
      }
    } catch (error) {
      setError("Error deleting promotion");
      console.error("Delete Error:", error);
    }
  };

  const confirmDelete = (promoId: number) => {
    setShowDeleteConfirm(promoId);
  };

  const isPromotionActive = useCallback((valid_until: string): boolean => {
    if (!valid_until) return true;
    try {
      const expiryDate = new Date(valid_until);
      const today = new Date();
      return expiryDate >= today;
    } catch {
      return true;
    }
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPromotions = filteredPromotions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="max-w-8xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Promotion Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage promotions for all cafes
              </p>
            </div>
            <button
              onClick={handleAddPromotion}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Promotion
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {filterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10 p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Cafe
                      </label>
                      <select
                        value={filters.cafeId}
                        onChange={(e) =>
                          setFilters({ ...filters, cafeId: e.target.value })
                        }
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Cafes</option>
                        {cafes.map((cafe) => (
                          <option key={cafe.id} value={cafe.id}>
                            {cafe.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.activeOnly}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              activeOnly: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                          Show active promotions only
                        </span>
                      </label>
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={resetFilters}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reset
                      </button>
                      <button
                        onClick={() => setFilterMenuOpen(false)}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading promotions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("title")}
                        className="group inline-flex items-center"
                      >
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          Promotion
                        </span>
                        {sortField === "title" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("cafeName")}
                        className="group inline-flex items-center"
                      >
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          Cafe
                        </span>
                        {sortField === "cafeName" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("valid_until")}
                        className="group inline-flex items-center"
                      >
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          Valid Until
                        </span>
                        {sortField === "valid_until" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-4 py-3 text-left">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Status
                      </span>
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentPromotions.map((promo) => {
                    const isActive = isPromotionActive(promo.valid_until);
                    const isExpanded = expandedPromo === promo.id;
                    return (
                      <React.Fragment key={promo.id}>
                        <tr
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            isExpanded ? "bg-gray-50 dark:bg-gray-700" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                                {promo.icon === "coffee" && (
                                  <Coffee className="text-white h-5 w-5" />
                                )}
                                {promo.icon === "book" && (
                                  <Tag className="text-white h-5 w-5" />
                                )}
                                {promo.icon === "laptop" && (
                                  <Wifi className="text-white h-5 w-5" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {promo.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                  {promo.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {promo.cafeName}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {formatDisplayDate(promo.valid_until)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {isActive ? "Active" : "Expired"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => togglePromoExpansion(promo.id)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none"
                                title={
                                  isExpanded ? "Hide details" : "Show details"
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 transform -rotate-90" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditPromotion(promo)}
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                                title="Edit promotion"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => confirmDelete(promo.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                                title="Delete promotion"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <td colSpan={5} className="px-4 py-3">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <div className="mb-2">
                                  <span className="font-medium">
                                    Description:
                                  </span>
                                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                                    {promo.description}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                  <span className="inline-flex items-center text-gray-600 dark:text-gray-300">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Created:{" "}
                                    {formatDisplayDate(
                                      promo.start_date?.split("T")[0] || ""
                                    )}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filteredPromotions.length === 0 && !loading && (
            <div className="py-8 text-center">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No promotions found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No promotions match your search criteria.
              </p>
              <div className="mt-6">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}

          {filteredPromotions.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredPromotions.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredPromotions.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === 1
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-200"
                            : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === totalPages
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirm Delete
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this promotion? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePromotion(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Promotion Modal */}
        {showAddModal && (
          <AddPromotionModal
            cafes={cafes}
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchPromotions();
            }}
          />
        )}

        {/* Edit Promotion Modal */}
        {showEditModal && editingPromotion && (
          <EditPromotionModal
            promotion={editingPromotion}
            cafes={cafes}
            onClose={() => {
              setShowEditModal(false);
              setEditingPromotion(null);
            }}
            onSuccess={() => {
              setShowEditModal(false);
              setEditingPromotion(null);
              fetchPromotions();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default PromotionManagement;
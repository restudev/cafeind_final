import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  Star,
  MapPin,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Coffee,
  AlertTriangle,
} from "lucide-react";
import Button from "../../../components/common/Button";
import { Cafe } from "../../../types/cafe";

// Interface for API response
interface ApiCafe {
  id: string;
  name: string;
  address: string;
  area: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  priceRange: number;
  noiseLevel: string;
  avgVisitLength: string;
  openingHours?: {
    Weekdays?: string;
    Weekends?: string;
  };
  featured?: boolean;
  menuLink?: string;
  website?: string;
  linkMaps?: string;
  instagram?: string;
  amenities?: string[];
  tags?: string[];
  reviews?: Array<{
    wifiQuality: number;
    powerOutlets: number;
    comfortLevel: number;
    comment: string;
    date: string;
    user: string;
  }>;
  menu?: Array<{
    name: string;
    category: string;
    priceIDR: number;
    specialty: boolean;
  }>;
  promo?: Array<{
    title: string;
    description: string;
    valid_until: string;
    icon: string;
  }>;
  location?: string;
  rating?: number;
}

// Modal component for delete confirmation
const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, title, message, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all duration-300 scale-100 animate-in fade-in-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border-gray-300 hover:bg-gray-100"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const formatPriceRange = (priceRange: number): string => {
  switch (priceRange) {
    case 1:
      return "💵 Budget Friendly";
    case 2:
      return "💰 Mid Range";
    case 3:
      return "💎 Premium";
    default:
      return "N/A";
  }
};

const CafeList: React.FC = () => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCafes, setSelectedCafes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id?: string;
    isBulk: boolean;
  }>({ isBulk: false });
  const [deleteMessage, setDeleteMessage] = useState({
    title: "",
    message: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(
          "http://localhost/cafeind_api/api/get_areas.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setAreas(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch areas");
        }
      } catch (error) {
        console.error("Error fetching areas:", error);
        setAreas([]);
      }
    };

    const fetchCafes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost/cafeind_api/api/get_cafes.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("API Response:", result);
        if (result.success) {
          const mappedCafes: Cafe[] = result.data.map((apiCafe: ApiCafe) => {
            console.log(`Cafe ${apiCafe.name} rating:`, apiCafe.rating);
            const cafe = {
              id: apiCafe.id,
              name: apiCafe.name,
              address: apiCafe.address,
              area: apiCafe.area,
              description: apiCafe.description,
              imageUrl: apiCafe.imageUrl || apiCafe.images?.[0] || null,
              images: apiCafe.images || [],
              priceRange: apiCafe.priceRange,
              noiseLevel: apiCafe.noiseLevel,
              avgVisitLength: apiCafe.avgVisitLength,
              openingHours: {
                Weekdays: apiCafe.openingHours?.Weekdays || "",
                Weekends: apiCafe.openingHours?.Weekends || "",
              },
              featured: apiCafe.featured || false,
              menuLink: apiCafe.menuLink || null,
              website: apiCafe.website || null,
              linkMaps: apiCafe.linkMaps || null,
              instagram: apiCafe.instagram || null,
              amenities: apiCafe.amenities || [],
              tags: apiCafe.tags || [],
              reviews: apiCafe.reviews || [],
              menu: apiCafe.menu || [],
              promo: apiCafe.promo || [],
              location: apiCafe.location || apiCafe.area,
              rating: typeof apiCafe.rating === "number" ? apiCafe.rating : 0,
            };
            return cafe;
          });
          console.log("Mapped Cafes:", mappedCafes);
          setCafes(mappedCafes);
        } else {
          throw new Error(result.message || "Failed to fetch cafes");
        }
      } catch (error) {
        console.error("Error fetching cafes:", error);
        setCafes([]);
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchAreas(), fetchCafes()]);
  }, []);

  // Filter and sort cafes
  const filteredCafes = cafes
    .filter((cafe) => {
      const matchesSearch =
        cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea =
        selectedArea === "" ||
        (areas.length > 0 && areas[0] === selectedArea) ||
        cafe.area === selectedArea;
      return matchesSearch && matchesArea;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortBy === "reviews") {
        return sortOrder === "asc"
          ? a.reviews.length - b.reviews.length
          : b.reviews.length - a.reviews.length;
      }
      return 0;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCafes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCafes.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCafes(currentItems.map((cafe) => cafe.id));
    } else {
      setSelectedCafes([]);
    }
  };

  // Handle select individual cafe
  const handleSelectCafe = (id: string) => {
    if (selectedCafes.includes(id)) {
      setSelectedCafes(selectedCafes.filter((cafeId) => cafeId !== id));
    } else {
      setSelectedCafes([...selectedCafes, id]);
    }
  };

  // Handle delete cafe
  const handleDeleteCafe = (id: string) => {
    const cafe = cafes.find((c) => c.id === id);
    setDeleteTarget({ id, isBulk: false });
    setDeleteMessage({
      title: "Delete Cafe",
      message: `Are you sure you want to delete "${cafe?.name}"? This action cannot be undone.`,
    });
    setIsDeleteModalOpen(true);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    setDeleteTarget({ isBulk: true });
    setDeleteMessage({
      title: `Delete ${selectedCafes.length} Cafe${
        selectedCafes.length > 1 ? "s" : ""
      }`,
      message: `Are you sure you want to delete ${selectedCafes.length} cafe${
        selectedCafes.length > 1 ? "s" : ""
      }? This action cannot be undone.`,
    });
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteTarget.isBulk) {
        const response = await fetch(
          "http://localhost/cafeind_api/api/delete_cafes.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedCafes }),
          }
        );
        const result = await response.json();
        if (result.success) {
          setCafes(cafes.filter((cafe) => !selectedCafes.includes(cafe.id)));
          setSelectedCafes([]);
        } else {
          throw new Error(result.message || "Failed to delete cafes");
        }
      } else if (deleteTarget.id) {
        const response = await fetch(
          `http://localhost/cafeind_api/api/delete_cafe.php?id=${deleteTarget.id}`,
          {
            method: "DELETE",
          }
        );
        const result = await response.json();
        if (result.success) {
          setCafes(cafes.filter((cafe) => cafe.id !== deleteTarget.id));
        } else {
          throw new Error(result.message || "Failed to delete cafe");
        }
      }
    } catch (error: unknown) {
      console.error("Error deleting:", error);
      toast.error(
        `Failed to delete: ${
          error instanceof Error ? error.message : "Please try again."
        }`
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteTarget({ isBulk: false });
      setDeleteMessage({ title: "", message: "" });
    }
  };

  // Toggle sort order
  const toggleSortOrder = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-600">Loading cafes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={deleteMessage.title}
        message={deleteMessage.message}
        isDeleting={isDeleting}
      />

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Cafes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all work-friendly cafes in Semarang
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            <Link to="/admin/add-cafe">
              <button className="inline-flex items-center px-6 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition-all">
                <Plus className="h-5 w-5 mr-2" />
                Add New Cafe
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search cafes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setSortOrder("asc");
                }}
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="reviews">Number of Reviews</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedArea("");
                  setSortBy("name");
                  setSortOrder("asc");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Cafes Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {selectedCafes.length > 0 && (
          <div className="bg-blue-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedCafes.length}{" "}
              {selectedCafes.length === 1 ? "cafe" : "cafes"} selected
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              Delete Selected
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={
                      currentItems.length > 0 &&
                      selectedCafes.length === currentItems.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    className="flex items-center space-x-1 focus:outline-none"
                    onClick={() => toggleSortOrder("name")}
                  >
                    <span>Cafe</span>
                    {sortBy === "name" && (
                      <span className="text-gray-400">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    className="flex items-center space-x-1 focus:outline-none"
                    onClick={() => toggleSortOrder("rating")}
                  >
                    <span>Rating</span>
                    {sortBy === "rating" && (
                      <span className="text-gray-400">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    className="flex items-center space-x-1 focus:outline-none"
                    onClick={() => toggleSortOrder("reviews")}
                  >
                    <span>Reviews</span>
                    {sortBy === "reviews" && (
                      <span className="text-gray-400">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price Range
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Coffee size={48} className="text-gray-300 mb-2" />
                      <p className="text-lg font-medium text-gray-600 mb-1">
                        No cafes found
                      </p>
                      <p className="text-sm text-gray-500">
                        {searchTerm || selectedArea
                          ? "Try adjusting your search or filters"
                          : "Add your first cafe to get started"}
                      </p>
                      {!searchTerm && !selectedArea && (
                        <Link to="/admin/cafes/new" className="mt-4">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Plus size={16} />}
                          >
                            Add New Cafe
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((cafe) => {
                  console.log(
                    `Rendering ${cafe.name} with rating:`,
                    cafe.rating
                  );
                  return (
                    <tr key={cafe.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={selectedCafes.includes(cafe.id)}
                          onChange={() => handleSelectCafe(cafe.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                            <img
                              src={
                                cafe.imageUrl ||
                                "https://via.placeholder.com/40x40?text=Cafe"
                              }
                              alt={cafe.name}
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {cafe.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {cafe.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1 text-gray-400" />
                          {cafe.area}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < Math.round(cafe.rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-500">
                            {cafe.rating > 0 ? cafe.rating.toFixed(1) : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cafe.reviews?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPriceRange(cafe.priceRange)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/cafes/${cafe.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          >
                            <span className="sr-only">View</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </Link>
                          <Link
                            to={`/admin/cafes/${cafe.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                          >
                            <span className="sr-only">Edit</span>
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteCafe(cafe.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            disabled={isDeleting}
                          >
                            <span className="sr-only">Delete</span>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCafes.length > itemsPerPage && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {indexOfLastItem > filteredCafes.length
                      ? filteredCafes.length
                      : indexOfLastItem}
                  </span>{" "}
                  of <span className="font-medium">{filteredCafes.length}</span>{" "}
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
                      paginate(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      paginate(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeList;

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Coffee,
  Star,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Building2,
} from "lucide-react";
import AdminLayout from "../../components/Admin/Layout/AdminLayout";
import { MenuItem, Cafe, menuCategories, API_BASE_URL } from "../../types/menu";

interface MenuItemWithCafe extends MenuItem {
  cafe_name?: string;
}

const MenuManagement: React.FC = () => {
  const { cafe_id } = useParams<{ cafe_id: string }>();

  const [menuItems, setMenuItems] = useState<MenuItemWithCafe[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItemWithCafe[]>([]);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCafeFilter, setSelectedCafeFilter] = useState("All");
  const [showSpecialtyOnly, setShowSpecialtyOnly] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemWithCafe | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItemWithCafe | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    category: "Coffee",
    priceIDR: 0,
    specialty: false,
    cafe_id: undefined,
  });

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

  const fetchCafes = useCallback(async () => {
    try {
      console.log("Fetching all cafes...");
      const response = await fetch(`${API_BASE_URL}/get_cafes.php`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Cafes response:", result);

      if (result.success) {
        const cafeList = result.data || [];
        setCafes(cafeList);

        // If we have a cafe_id from URL, find and set the selected cafe
        if (cafe_id) {
          const numericCafeId = parseInt(cafe_id, 10);
          const foundCafe = cafeList.find(
            (cafe: Cafe) => cafe.id === numericCafeId
          );
          if (foundCafe) {
            setSelectedCafe(foundCafe);
            setSelectedCafeFilter(foundCafe.id.toString());
          } else {
            setError(`Cafe with ID ${cafe_id} not found`);
          }
        }
      } else {
        throw new Error(result.message || "Failed to fetch cafes");
      }
    } catch (error) {
      const errorMessage = "Error fetching cafes: " + (error as Error).message;
      setError(errorMessage);
      console.error("Error fetching cafes:", error);
    }
  }, [cafe_id]);

  const fetchAllMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching all menu items...");

      const response = await fetch(`${API_BASE_URL}/get_menu_items.php`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("All menu items response:", result);

      if (result.success) {
        const items = result.data || [];
        setMenuItems(items);
        console.log("Loaded", items.length, "menu items from all cafes");
      } else {
        throw new Error(result.message || "Failed to fetch menu items");
      }
    } catch (error) {
      const errorMessage =
        "Error fetching menu items: " + (error as Error).message;
      setError(errorMessage);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenuItemsForCafe = useCallback(
    async (cafeId: number) => {
      try {
        setLoading(true);
        setError("");
        console.log("Fetching menu items for cafe_id:", cafeId);

        const response = await fetch(
          `${API_BASE_URL}/get_menu_items.php?cafe_id=${cafeId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Menu items response:", result);

        if (result.success) {
          const items = result.data || [];
          // Add cafe name to each item
          const itemsWithCafeName = items.map((item: MenuItem) => ({
            ...item,
            cafe_name: selectedCafe?.name || "Unknown Cafe",
          }));
          setMenuItems(itemsWithCafeName);
          console.log("Loaded", items.length, "menu items for cafe", cafeId);
        } else {
          throw new Error(result.message || "Failed to fetch menu items");
        }
      } catch (error) {
        const errorMessage =
          "Error fetching menu items: " + (error as Error).message;
        setError(errorMessage);
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedCafe]
  );

  const filterItems = useCallback(() => {
    let filtered = [...menuItems];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.cafe_name &&
            item.cafe_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedCafeFilter !== "All") {
      filtered = filtered.filter(
        (item) => item.cafe_id?.toString() === selectedCafeFilter
      );
    }

    if (showSpecialtyOnly) {
      filtered = filtered.filter((item) => item.specialty);
    }

    setFilteredItems(filtered);
  }, [
    menuItems,
    searchTerm,
    selectedCategory,
    selectedCafeFilter,
    showSpecialtyOnly,
  ]);

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  useEffect(() => {
    if (cafes.length > 0) {
      if (cafe_id && selectedCafe) {
        // Fetch menu items for specific cafe
        fetchMenuItemsForCafe(selectedCafe.id);
      } else {
        // Fetch all menu items
        fetchAllMenuItems();
      }
    }
  }, [cafes, cafe_id, selectedCafe, fetchAllMenuItems, fetchMenuItemsForCafe]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name?.trim() ||
      !formData.category ||
      !formData.priceIDR ||
      formData.priceIDR <= 0 ||
      !formData.cafe_id
    ) {
      setError(
        "Please fill in all required fields with valid values and select a cafe"
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingItem
        ? `${API_BASE_URL}/update_menu_item.php`
        : `${API_BASE_URL}/add_menu_item.php`;

      const payload = {
        ...formData,
        id: editingItem?.id,
        name: formData.name.trim(),
        priceIDR: parseInt(String(formData.priceIDR)),
        specialty: Boolean(formData.specialty),
        cafe_id: parseInt(String(formData.cafe_id)),
      };

      console.log("Sending payload:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submit response:", result);

      if (result.success) {
        setSuccess(
          editingItem
            ? "Menu item updated successfully"
            : "Menu item added successfully"
        );

        // Refresh menu items
        if (cafe_id && selectedCafe) {
          await fetchMenuItemsForCafe(selectedCafe.id);
        } else {
          await fetchAllMenuItems();
        }
        resetForm();
      } else {
        throw new Error(result.message || "Failed to save menu item");
      }
    } catch (error) {
      const errorMessage =
        "Error saving menu item: " + (error as Error).message;
      setError(errorMessage);
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) {
      setError("No item selected for deletion");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        id: deletingItem.id,
        cafe_id: deletingItem.cafe_id,
      };
      console.log("Delete payload:", payload);

      const response = await fetch(`${API_BASE_URL}/delete_menu_item.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Delete response:", result);

      if (result.success) {
        setSuccess("Menu item deleted successfully");

        // Refresh menu items
        if (cafe_id && selectedCafe) {
          await fetchMenuItemsForCafe(selectedCafe.id);
        } else {
          await fetchAllMenuItems();
        }
        setDeletingItem(null);
      } else {
        throw new Error(result.message || "Failed to delete menu item");
      }
    } catch (error) {
      const errorMessage =
        "Error deleting menu item: " + (error as Error).message;
      setError(errorMessage);
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Coffee",
      priceIDR: 0,
      specialty: false,
      cafe_id: cafe_id ? parseInt(cafe_id) : undefined,
    });
    setEditingItem(null);
    setShowAddModal(false);
  };

  const startEdit = (item: MenuItemWithCafe) => {
    setFormData({
      ...item,
      priceIDR: item.priceIDR,
    });
    setEditingItem(item);
    setShowAddModal(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Group items by cafe if showing all cafes, otherwise by category
  const groupedItems = cafe_id
    ? filteredItems.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {} as Record<string, MenuItemWithCafe[]>)
    : filteredItems.reduce((acc, item) => {
        const cafeName = item.cafe_name || "Unknown Cafe";
        if (!acc[cafeName]) {
          acc[cafeName] = [];
        }
        acc[cafeName].push(item);
        return acc;
      }, {} as Record<string, MenuItemWithCafe[]>);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading menu items...
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Menu Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {selectedCafe
                    ? `${selectedCafe.name} - Manage menu items`
                    : "Manage menu items for all cafes"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-6 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Menu Item
            </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search menu items or cafes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="All">All Categories</option>
                {menuCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {!cafe_id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cafe
                </label>
                <select
                  value={selectedCafeFilter}
                  onChange={(e) => setSelectedCafeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="All">All Cafes</option>
                  {cafes.map((cafe) => (
                    <option key={cafe.id} value={cafe.id.toString()}>
                      {cafe.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showSpecialtyOnly}
                  onChange={(e) => setShowSpecialtyOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Specialty Only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-6">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No menu items found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {menuItems.length === 0
                  ? "Start by adding your first menu item"
                  : "Try adjusting your filters to see more items"}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Menu Item
              </button>
            </div>
          ) : (
            Object.entries(groupedItems).map(([groupName, items]) => (
              <div
                key={groupName}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {cafe_id ? (
                      <Coffee className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {groupName} ({items.length})
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 transition-all hover:shadow-md border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {item.name}
                              </h4>
                              {item.specialty && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {item.category}
                            </p>
                            {!cafe_id && item.cafe_name && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                                {item.cafe_name}
                              </p>
                            )}
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {formatPrice(item.priceIDR)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeletingItem(item)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cafe *
                    </label>
                    <select
                      value={formData.cafe_id || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cafe_id: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                      disabled={!!cafe_id} // Disable if we're in single cafe mode
                    >
                      <option value="">Select a cafe</option>
                      {cafes.map((cafe) => (
                        <option key={cafe.id} value={cafe.id}>
                          {cafe.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category || "Coffee"}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    >
                      {menuCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (IDR) *
                    </label>
                    <input
                      type="number"
                      value={formData.priceIDR || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priceIDR: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.specialty || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialty: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Specialty Item
                    </span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving
                      ? "Saving..."
                      : editingItem
                      ? "Update Item"
                      : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete Menu Item
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete "{deletingItem.name}"
                  {deletingItem.cafe_name && ` from ${deletingItem.cafe_name}`}?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setDeletingItem(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Deleting..." : "Delete"}
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

export default MenuManagement;

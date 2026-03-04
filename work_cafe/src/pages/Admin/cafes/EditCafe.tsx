import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Coffee,
  X,
  Loader2,
  AlertCircle,
  Clock,
  Upload,
  Tag,
} from "lucide-react";
import AdminLayout from "../../../components/Admin/Layout/AdminLayout";
import BasicInfoTab from "./BasicInfoTab";
import DetailsTab from "./DetailsTab";
import ImagesTab from "./ImagesTab";
import PromotionsTab from "./PromotionsTab";
import { Cafe, API_BASE_URL, Promo, CafeImage } from "../../../types/cafe";

const EditCafe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [initialCafeName, setInitialCafeName] = useState("New Cafe");
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  const [cafeData, setCafeData] = useState<Cafe>({
    id: "",
    name: "",
    address: "",
    area: "",
    description: "",
    imageUrl: "",
    images: [],
    priceRange: 1,
    noiseLevel: "Moderate",
    avgVisitLength: "1-2 hours",
    openingHours: {
      Weekdays: "9:00 AM - 10:00 PM",
      Weekends: "10:00 AM - 8:00 PM",
    },
    featured: false,
    menuLink: null,
    website: null,
    linkMaps: null,
    instagram: null,
    amenities: [],
    tags: [],
    reviews: [],
    menu: [],
    promo: [],
    rating: 0,
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchCafe = async () => {
      if (!id) {
        setErrors((prev) => ({ ...prev, fetch: "Invalid cafe ID" }));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/update_cafe.php?cafe_id=${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error(result.message || "Cafe not found");
        }

        const { cafe, images, promotions } = result.data;

        const transformedImages: CafeImage[] = images.map((img: any) => ({
          id: img.id,
          image_url: img.image_url,
          is_primary: Boolean(img.is_primary),
        }));

        setCafeData({
          id: cafe.id || "",
          name: cafe.name || "",
          address: cafe.address || "",
          area: cafe.area || "",
          description: cafe.description || "",
          imageUrl: cafe.imageUrl || "",
          images: transformedImages,
          priceRange: Number(cafe.priceRange) || 1,
          noiseLevel: cafe.noiseLevel || "Moderate",
          avgVisitLength: cafe.avgVisitLength || "1-2 hours",
          openingHours: cafe.openingHours || {
            Weekdays: "9:00 AM - 10:00 PM",
            Weekends: "10:00 AM - 8:00 PM",
          },
          featured: Boolean(cafe.featured),
          menuLink: cafe.menuLink || "",
          website: cafe.website || "",
          linkMaps: cafe.linkMaps || "",
          instagram: cafe.instagram || "",
          amenities: cafe.amenities || [],
          tags: cafe.tags || [],
          reviews: [],
          menu: [],
          promo: promotions || [],
          rating: Number(cafe.rating) || 0,
        });

        setInitialCafeName(cafe.name || "New Cafe");
      } catch (error) {
        console.error("Error fetching cafe:", error);
        setErrors((prev) => ({
          ...prev,
          fetch: `Failed to load cafe: ${(error as Error).message}`,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchCafe();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCafeData((prev) => ({ ...prev, [name]: value }));
    setUnsavedChanges(true);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCafeData((prev) => ({ ...prev, [name]: checked }));
    setUnsavedChanges(true);
  };

  const handlePriceChange = (price: 1 | 2 | 3) => {
    setCafeData((prev) => ({ ...prev, priceRange: price }));
    setUnsavedChanges(true);
  };

  const handleOpeningHoursChange = (
    field: "Weekdays" | "Weekends",
    value: string
  ) => {
    setCafeData((prev) => ({
      ...prev,
      openingHours: { ...prev.openingHours, [field]: value },
    }));
    setUnsavedChanges(true);
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setErrors((prev) => ({ ...prev, imageUpload: "" }));

    try {
      const uploadedImages: CafeImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) {
          throw new Error(`File ${file.name} is not an image`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(
            `File ${file.name} is too large. Maximum size is 5MB`
          );
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("cafe_id", cafeData.id);

        const response = await fetch(`${API_BASE_URL}/upload_image.php`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || `Failed to upload ${file.name}`);
        }

        uploadedImages.push({
          id: result.data.id,
          image_url: result.data.image_url,
          is_primary: result.data.is_primary,
        });
      }

      setCafeData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
        imageUrl:
          prev.images.length === 0 && uploadedImages.length > 0
            ? uploadedImages[0].image_url
            : prev.imageUrl,
      }));

      setUnsavedChanges(true);
    } catch (error) {
      console.error("Error uploading images:", error);
      setErrors((prev) => ({
        ...prev,
        imageUpload: `Upload failed: ${(error as Error).message}`,
      }));
    } finally {
      setUploadingImages(false);
    }
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) {
      setErrors((prev) => ({ ...prev, newImage: "Image URL is required" }));
      return;
    }

    if (!/^https?:\/\/.+$/.test(newImageUrl)) {
      setErrors((prev) => ({ ...prev, newImage: "Invalid image URL" }));
      return;
    }

    let transformedUrl = newImageUrl;
    if (newImageUrl.includes("drive.google.com/file/d/")) {
      const match = newImageUrl.match(
        /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
      );
      if (match && match[1]) {
        transformedUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }

    if (!cafeData.images.some((img) => img.image_url === transformedUrl)) {
      const newImage: CafeImage = {
        image_url: transformedUrl,
        is_primary: cafeData.images.length === 0,
      };
      setCafeData((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
        imageUrl: cafeData.images.length === 0 ? transformedUrl : prev.imageUrl,
      }));
      setNewImageUrl("");
      setUnsavedChanges(true);
      setErrors((prev) => ({ ...prev, newImage: "" }));
    } else {
      setErrors((prev) => ({ ...prev, newImage: "Image URL already exists" }));
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = cafeData.images[index];

    if (!imageToRemove) {
      console.error("Image not found at index:", index);
      return;
    }

    setErrors((prev) => ({ ...prev, imageDelete: "" }));

    if (imageToRemove.id !== undefined && imageToRemove.id !== null) {
      setDeletingImageId(imageToRemove.id);

      try {
        console.log("Deleting image:", {
          image_id: imageToRemove.id,
          cafe_id: parseInt(cafeData.id),
          image_url: imageToRemove.image_url,
        });

        const response = await fetch(`${API_BASE_URL}/delete_image.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_id: imageToRemove.id,
            cafe_id: parseInt(cafeData.id),
          }),
        });

        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          console.error("Failed to parse response:", parseError);
          throw new Error("Invalid response from server");
        }

        if (!response.ok) {
          console.error("HTTP error:", response.status, response.statusText);
          throw new Error(result?.message || `HTTP error: ${response.status}`);
        }

        if (!result.success) {
          console.error("Server error:", result);
          throw new Error(result.message || "Failed to delete image");
        }

        console.log("Image deleted successfully:", result);

        setCafeData((prev) => {
          const updatedImages = prev.images.filter((_, i) => i !== index);
          let updatedMainImage = prev.imageUrl;

          if (result.data.was_primary) {
            updatedMainImage = result.data.new_primary_image_url || "";
          }

          return {
            ...prev,
            images: updatedImages,
            imageUrl: updatedMainImage,
          };
        });

        setUnsavedChanges(true);
      } catch (error) {
        console.error("Error deleting image:", error);
        setErrors((prev) => ({
          ...prev,
          imageDelete: `Failed to delete image: ${(error as Error).message}`,
        }));
      } finally {
        setDeletingImageId(null);
      }
    } else {
      console.log("Removing unsaved image from UI");
      setCafeData((prev) => {
        const updatedImages = prev.images.filter((_, i) => i !== index);
        let updatedMainImage = prev.imageUrl;

        if (prev.imageUrl === imageToRemove.image_url) {
          if (updatedImages.length > 0) {
            updatedMainImage = updatedImages[0].image_url;
          } else {
            updatedMainImage = "";
          }
        }

        return {
          ...prev,
          images: updatedImages,
          imageUrl: updatedMainImage,
        };
      });

      setUnsavedChanges(true);
    }
  };

  const setMainImage = (index: number) => {
    setCafeData((prev) => ({
      ...prev,
      imageUrl: prev.images[index]?.image_url,
      images: prev.images.map((img, i) => ({
        ...img,
        is_primary: i === index,
      })),
    }));
    setUnsavedChanges(true);
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !cafeData.amenities.includes(newAmenity)) {
      setCafeData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity],
      }));
      setNewAmenity("");
      setUnsavedChanges(true);
    }
  };

  const removeAmenity = (amenity: string) => {
    setCafeData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
    setUnsavedChanges(true);
  };

  const toggleAmenity = (amenity: string) => {
    setCafeData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
    setUnsavedChanges(true);
  };

  const addTag = () => {
    if (newTag.trim() && !cafeData.tags.includes(newTag)) {
      setCafeData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag("");
      setUnsavedChanges(true);
    }
  };

  const removeTag = (tag: string) => {
    setCafeData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
    setUnsavedChanges(true);
  };

  const addPromotion = () => {
    const defaultValidUntil = new Date();
    defaultValidUntil.setDate(defaultValidUntil.getDate() + 30); // 30 days from now
    defaultValidUntil.setHours(23, 59, 59, 999); // End of day

    const newPromo: Promo = {
      id: `temp_${Date.now()}`,
      title: "New Promotion",
      description: "Promotion description goes here",
      valid_until: defaultValidUntil.toISOString(), // Use full ISO string with time
      icon: "coffee",
    };
    setCafeData((prev) => ({
      ...prev,
      promo: [...prev.promo, newPromo],
    }));
    setUnsavedChanges(true);
  };

  const updatePromotion = (
    id: string | number,
    field: keyof Promo,
    value: string
  ) => {
    setCafeData((prev) => ({
      ...prev,
      promo: prev.promo.map((promo) =>
        promo.id === id ? { ...promo, [field]: value } : promo
      ),
    }));
    setUnsavedChanges(true);
  };

  const removePromotion = (id: string | number) => {
    setCafeData((prev) => ({
      ...prev,
      promo: prev.promo.filter((promo) => promo.id !== id),
    }));
    setUnsavedChanges(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!cafeData.name.trim()) newErrors.name = "Cafe name is required";
    if (!cafeData.address.trim()) newErrors.address = "Address is required";
    if (!cafeData.area.trim()) newErrors.area = "Area is required";
    if (!cafeData.description.trim())
      newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("cafe_id", cafeData.id);
      formData.append("name", cafeData.name);
      formData.append("address", cafeData.address);
      formData.append("area", cafeData.area);
      formData.append("description", cafeData.description);
      formData.append("image_url", cafeData.imageUrl || "");
      formData.append(
        "images",
        JSON.stringify(
          cafeData.images.map((img) => ({
            id: img.id || null,
            image_url: img.image_url,
            is_primary: img.is_primary,
          }))
        )
      );
      formData.append("price_range", cafeData.priceRange.toString());
      formData.append("noise_level", cafeData.noiseLevel);
      formData.append("avg_visit_length", cafeData.avgVisitLength);
      formData.append("opening_hours", JSON.stringify(cafeData.openingHours));
      formData.append("featured", cafeData.featured ? "1" : "0");
      formData.append("menuLink", cafeData.menuLink || "");
      formData.append("website", cafeData.website || "");
      formData.append("linkMaps", cafeData.linkMaps || "");
      formData.append("instagram", cafeData.instagram || "");
      formData.append("amenities", JSON.stringify(cafeData.amenities));
      formData.append("tags", JSON.stringify(cafeData.tags));
      formData.append(
        "promo",
        JSON.stringify(
          cafeData.promo.map((promo) => ({
            id:
              typeof promo.id === "string" && promo.id.startsWith("temp_")
                ? null
                : promo.id,
            title: promo.title,
            description: promo.description,
            valid_until: promo.valid_until,
            icon: promo.icon,
          }))
        )
      );

      const response = await fetch(`${API_BASE_URL}/update_cafe.php`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update cafe");
      }

      setUnsavedChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving cafe:", error);
      setErrors((prev) => ({
        ...prev,
        submit: `Failed to save cafe: ${(error as Error).message}`,
      }));
    } finally {
      setSaving(false);
    }
  };

  const cancelForm = () => {
    if (
      unsavedChanges &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      )
    ) {
      return;
    }
    navigate("/admin/cafes");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading cafe details...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (errors.fetch) {
    return (
      <AdminLayout>
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
                Error Loading Cafe
              </h3>
              <p className="text-red-700 dark:text-red-400 mt-1">
                {errors.fetch}
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-8xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Cafe: {initialCafeName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update cafe details and manage information
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelForm}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="h-5 w-5 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`inline-flex items-center px-6 py-2 rounded-lg text-white font-medium transition-all ${
                  saving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  Cafe updated successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-800 dark:text-red-300">
                {errors.submit}
              </span>
            </div>
          </div>
        )}

        {errors.imageDelete && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-800 dark:text-red-300">
                {errors.imageDelete}
              </span>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: "basic", label: "Basic Info", icon: Coffee },
                { id: "details", label: "Details", icon: Clock },
                { id: "images", label: "Images", icon: Upload },
                { id: "promotions", label: "Promotions", icon: Tag },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === "basic" && (
              <BasicInfoTab
                cafeData={cafeData}
                errors={errors}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                setErrors={setErrors}
              />
            )}
            {activeTab === "details" && (
              <DetailsTab
                cafeData={cafeData}
                newAmenity={newAmenity}
                newTag={newTag}
                setNewAmenity={setNewAmenity}
                setNewTag={setNewTag}
                handleChange={handleChange}
                handlePriceChange={handlePriceChange}
                handleOpeningHoursChange={handleOpeningHoursChange}
                toggleAmenity={toggleAmenity}
                addAmenity={addAmenity}
                removeAmenity={removeAmenity}
                addTag={addTag}
                removeTag={removeTag}
              />
            )}
            {activeTab === "images" && (
              <ImagesTab
                cafeData={cafeData}
                newImageUrl={newImageUrl}
                errors={errors}
                uploadingImages={uploadingImages}
                deletingImageId={deletingImageId}
                setNewImageUrl={setNewImageUrl}
                addImageUrl={addImageUrl}
                handleFileUpload={handleFileUpload}
                removeImage={removeImage}
                setMainImage={setMainImage}
              />
            )}
            {activeTab === "promotions" && (
              <PromotionsTab
                cafeData={cafeData}
                addPromotion={addPromotion}
                updatePromotion={updatePromotion}
                removePromotion={removePromotion}
              />
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditCafe;
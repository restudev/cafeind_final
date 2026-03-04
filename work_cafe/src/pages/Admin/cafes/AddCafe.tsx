import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  Coffee,
  X,
  Loader2,
  AlertCircle,
  Clock,
  Upload,
  Tag,
  CheckCircle,
} from "lucide-react";
import AdminLayout from "../../../components/Admin/Layout/AdminLayout";
import BasicInfoTab from "./BasicInfoTab";
import DetailsTab from "./DetailsTab";
import ImagesTab from "./ImagesTab";
import PromotionsTab from "./PromotionsTab";
import { Cafe, API_BASE_URL, Promo, CafeImage } from "../../../types/cafe";

const AddCafe: React.FC = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

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
    menuLink: "",
    website: "",
    linkMaps: "",
    instagram: "",
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
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCafeData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCafeData((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePriceChange = (price: 1 | 2 | 3) => {
    setCafeData((prev) => ({ ...prev, priceRange: price }));
  };

  const handleOpeningHoursChange = (
    field: "Weekdays" | "Weekends",
    value: string
  ) => {
    setCafeData((prev) => ({
      ...prev,
      openingHours: { ...prev.openingHours, [field]: value },
    }));
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setErrors((prev) => ({ ...prev, imageUpload: "" }));

    try {
      const validFiles: File[] = [];
      const previewImages: CafeImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) {
          throw new Error(`File ${file.name} is not an image`);
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error(
            `File ${file.name} is too large. Maximum size is 10MB`
          );
        }

        validFiles.push(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: CafeImage = {
            image_url: e.target?.result as string,
            is_primary:
              cafeData.images.length === 0 && previewImages.length === 0,
          };
          previewImages.push(newImage);

          if (previewImages.length === validFiles.length) {
            setCafeData((prev) => ({
              ...prev,
              images: [...prev.images, ...previewImages],
              imageUrl:
                prev.images.length === 0 && previewImages.length > 0
                  ? previewImages[0].image_url
                  : prev.imageUrl,
            }));
          }
        };
        reader.readAsDataURL(file);
      }

      // Store files for later upload
      setPendingFiles((prev) => [...prev, ...validFiles]);
    } catch (error) {
      console.error("Error processing images:", error);
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
      setErrors((prev) => ({ ...prev, newImage: "" }));
    } else {
      setErrors((prev) => ({ ...prev, newImage: "Image URL already exists" }));
    }
  };

  const removeImage = (index: number) => {
    setCafeData((prev) => {
      const imageToRemove = prev.images[index];
      const updatedImages = prev.images.filter((_, i) => i !== index);
      let updatedMainImage = prev.imageUrl;

      // If removing the main image, set a new main image
      if (prev.imageUrl === imageToRemove?.image_url) {
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

    // Also remove from pending files if it's a file upload
    const imageToRemove = cafeData.images[index];
    if (imageToRemove?.image_url.startsWith("data:")) {
      setPendingFiles((prev) => prev.slice(0, -1)); // Remove last added file
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
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !cafeData.amenities.includes(newAmenity)) {
      setCafeData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setCafeData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setCafeData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !cafeData.tags.includes(newTag)) {
      setCafeData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setCafeData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addPromotion = () => {
    const defaultValidUntil = new Date();
    defaultValidUntil.setDate(defaultValidUntil.getDate() + 30);
    const defaultStartDate = new Date(); // Add default start date (today)

    const newPromo: Promo = {
      id: `temp_${Date.now()}`,
      title: "New Promotion",
      description: "Promotion description goes here",
      start_date: defaultStartDate.toISOString().split("T")[0], // Add start_date
      valid_until: defaultValidUntil.toISOString().split("T")[0],
      icon: "coffee",
    };
    setCafeData((prev) => ({
      ...prev,
      promo: [...prev.promo, newPromo],
    }));
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
  };

  const removePromotion = (id: string | number) => {
    setCafeData((prev) => ({
      ...prev,
      promo: prev.promo.filter((promo) => promo.id !== id),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!cafeData.name.trim()) newErrors.name = "Cafe name is required";
    if (!cafeData.address.trim()) newErrors.address = "Address is required";
    if (!cafeData.area.trim()) newErrors.area = "Area is required";
    if (!cafeData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadPendingFiles = async (cafeId: string) => {
    if (pendingFiles.length === 0) return [];

    const uploadedImages: CafeImage[] = [];

    for (const file of pendingFiles) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("cafe_id", cafeId);

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
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }

    return uploadedImages;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setActiveTab("basic"); // Switch to basic tab if there are validation errors
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      // First, create the cafe
      const formData = new FormData();
      formData.append("name", cafeData.name);
      formData.append("address", cafeData.address);
      formData.append("area", cafeData.area);
      formData.append("description", cafeData.description);
      formData.append("image_url", ""); // Will be updated after image upload
      formData.append("price_range", cafeData.priceRange.toString());
      formData.append("noise_level", cafeData.noiseLevel);
      formData.append("avg_visit_length", cafeData.avgVisitLength);
      formData.append("opening_hours", JSON.stringify(cafeData.openingHours));
      formData.append("featured", cafeData.featured ? "1" : "0");
      formData.append("menu_link", cafeData.menuLink || "");
      formData.append("website", cafeData.website || "");
      formData.append("link_maps", cafeData.linkMaps || "");
      formData.append("instagram", cafeData.instagram || "");
      formData.append("amenities", JSON.stringify(cafeData.amenities));
      formData.append("tags", JSON.stringify(cafeData.tags));

      // Handle URL-based images (not file uploads)
      const urlImages = cafeData.images
        .filter((img) => img.image_url.startsWith("http"))
        .map((img) => ({
          image_url: img.image_url,
          is_primary: img.is_primary,
        }));
      formData.append("images", JSON.stringify(urlImages));

      // Handle promotions
      const promotions = cafeData.promo.map((promo) => ({
        title: promo.title,
        description: promo.description,
        start_date: promo.start_date, // Include start_date
        valid_until: promo.valid_until,
        icon: promo.icon,
      }));
      formData.append("promotions", JSON.stringify(promotions));

      const response = await fetch(`${API_BASE_URL}/add_cafe.php`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create cafe");
      }

      const cafeId = result.data.cafe.id;

      // Upload pending files to Cloudinary
      if (pendingFiles.length > 0) {
        try {
          await uploadPendingFiles(cafeId.toString());
        } catch (uploadError) {
          console.error("Some images failed to upload:", uploadError);
          // Don't fail the entire operation if image upload fails
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/admin/cafes");
      }, 2000);
    } catch (error) {
      console.error("Error creating cafe:", error);
      setErrors((prev) => ({
        ...prev,
        submit: `Failed to create cafe: ${(error as Error).message}`,
      }));
    } finally {
      setSaving(false);
    }
  };

  const cancelForm = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All changes will be lost."
      )
    ) {
      navigate("/admin/cafes");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-8xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Add New Cafe
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a new cafe listing with all the details
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
                {saving ? "Creating..." : "Create Cafe"}
              </button>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <p className="text-green-800 dark:text-green-300 font-medium">
                  Cafe created successfully!
                </p>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  Redirecting to cafe list...
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
                const hasErrors =
                  tab.id === "basic" &&
                  Object.keys(errors).some((key) =>
                    ["name", "address", "area", "description"].includes(key)
                  );

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors relative ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {hasErrors && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                    )}
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
                deletingImageId={null}
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

export default AddCafe;
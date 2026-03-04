import React from "react";
import { Upload, Plus, X, Star, Loader2, AlertCircle } from "lucide-react";
import { Cafe } from "../../../types/cafe";

interface ImagesTabProps {
  cafeData: Cafe;
  newImageUrl: string;
  errors: Record<string, string>;
  uploadingImages: boolean;
  deletingImageId: number | null;
  setNewImageUrl: (url: string) => void;
  addImageUrl: () => void;
  handleFileUpload: (files: FileList) => void;
  removeImage: (index: number) => void;
  setMainImage: (index: number) => void;
}

const ImagesTab: React.FC<ImagesTabProps> = ({
  cafeData,
  newImageUrl,
  errors,
  uploadingImages,
  setNewImageUrl,
  addImageUrl,
  handleFileUpload,
  removeImage,
  setMainImage,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Cafe Images
        </h3>
        
        {/* Upload Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload Images
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop or click to select images
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={uploadingImages}
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors ${
                uploadingImages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploadingImages ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </>
              )}
            </label>
            <p className="text-xs text-gray-400 mt-2">
              Maximum 5MB per image. Supported formats: JPG, PNG, WebP
            </p>
          </div>

          {/* URL Input */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Add Image URL
            </h4>
            <div className="space-y-4">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </button>
            </div>
            {errors.newImage && (
              <div className="flex items-center mt-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">{errors.newImage}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Supports Google Drive links (will be auto-converted)
            </p>
          </div>
        </div>

        {errors.imageUpload && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800 dark:text-red-300">{errors.imageUpload}</span>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {cafeData.images.length > 0 ? (
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
              Uploaded Images ({cafeData.images.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cafeData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={image.image_url}
                      alt={`Cafe image ${index + 1}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                      }}
                    />
                  </div>
                  
                  {/* Image Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMainImage(index)}
                        className={`p-2 rounded-full transition-colors ${
                          image.is_primary
                            ? "bg-yellow-500 text-white"
                            : "bg-white text-gray-700 hover:bg-yellow-500 hover:text-white"
                        }`}
                        title={image.is_primary ? "Main image" : "Set as main image"}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Primary Badge */}
                  {image.is_primary && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Main
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> The first image will be used as the main cafe image. 
                You can change this by clicking the star icon on any image.
              </p>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No images uploaded
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add some images to showcase your cafe
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesTab;
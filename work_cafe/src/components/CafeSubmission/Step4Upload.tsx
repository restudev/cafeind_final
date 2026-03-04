import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, MessageSquare, Loader2 } from 'lucide-react';
import { CafeSubmissionData, UploadedImage, API_BASE_URL } from '../../types/cafeSubmission';

interface Step4UploadProps {
  data: CafeSubmissionData;
  updateData: (updates: Partial<CafeSubmissionData>) => void;
  errors: Record<string, string>;
}

const Step4Upload: React.FC<Step4UploadProps> = ({ 
  data, 
  updateData, 
  errors 
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} is too large (max 10MB)`);
        }

        const formData = new FormData();
        formData.append('image', file);

        console.log(`Uploading ${file.name} to ${API_BASE_URL}/upload_image_for_request.php`);

        const response = await fetch(`${API_BASE_URL}/upload_image_for_request.php`, {
          method: 'POST',
          body: formData,
          headers: {
            // Avoid setting Content-Type manually; fetch sets it correctly for FormData
          },
        }).catch((err) => {
          throw new Error(`Network error: ${err.message}`);
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
          let errorText;
          try {
            const result = await response.json();
            errorText = result.message || `HTTP ${response.status}`;
          } catch {
            errorText = await response.text();
          }
          throw new Error(`Upload failed: ${errorText}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Upload failed');
        }

        console.log('Upload successful:', result);

        return {
          url: result.data.image_url,
          cloudinary_public_id: result.data.cloudinary_public_id,
          file
        };
      });

      const results = await Promise.all(uploadPromises);
      const newImages = [...uploadedImages, ...results];
      setUploadedImages(newImages);
      
      // Update form data with image URLs
      updateData({ 
        image_urls: newImages.map(img => img.url) 
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError((error as Error).message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    updateData({ 
      image_urls: newImages.map(img => img.url) 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
            <ImageIcon className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Images & Notes</h2>
          <p className="text-gray-600">Add photos and any additional information</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Cafe Photos (Optional)</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Uploading images...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
              </div>
            )}
          </div>
          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
          {errors.fileUpload && <p className="mt-2 text-sm text-red-600">{errors.fileUpload}</p>}
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({uploadedImages.length})</p>
              <div className="grid grid-cols-2 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Failed';
                      }}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes for Admin (Optional)</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              value={data.additional_notes || ''}
              onChange={(e) => updateData({ additional_notes: e.target.value })}
              rows={8}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Any special information, operating hours changes, or other details you'd like to share with our admin team..."
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">Share any additional details that might be helpful</p>
            <span className="text-sm text-gray-400">{(data.additional_notes || '').length}/500</span>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Before You Submit</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Make sure all required information is accurate</li>
            <li>• Photos should clearly show the cafe's interior and atmosphere</li>
            <li>• Your submission will be reviewed by our team</li>
            <li>• We may contact you if we need additional information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step4Upload;
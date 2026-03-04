import React from "react";
import { Coffee, MapPin, LinkIcon } from "lucide-react";
import { Cafe, kecamatanOptions } from "../../../types/cafe";

interface BasicInfoTabProps {
  cafeData: Cafe;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  cafeData,
  errors,
  handleChange,
  handleCheckboxChange,
  setErrors,
}) => {
  // Improved URL validation to match backend
  const validateUrl = (value: string, field: string) => {
    if (!value) return ""; // Allow empty values
    
    // Add protocol if missing
    const urlWithProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    
    try {
      new URL(urlWithProtocol);
      return "";
    } catch {
      return `${field} must be a valid URL`;
    }
  };

  // Enhanced field value handler
  const getFieldValue = (value: any): string => {
    if (value === null || value === undefined || value === "null") {
      return "";
    }
    return String(value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "link_maps" || name === "menu_link" || name === "website") {
      const errorMessage = validateUrl(
        value,
        name === "link_maps" ? "Google Maps Link" : 
        name === "menu_link" ? "Menu Link" : "Website URL"
      );
      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cafe Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Coffee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={getFieldValue(cafeData.name)}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                errors.name ? "border-red-300" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter cafe name"
              required
            />
          </div>
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Area <span className="text-red-500">*</span>
          </label>
          <select
            id="area"
            name="area"
            value={getFieldValue(cafeData.area)}
            onChange={handleChange}
            className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
              errors.area ? "border-red-300" : "border-gray-300 dark:border-gray-600"
            }`}
            required
          >
            <option value="">Select an area</option>
            {kecamatanOptions.map((kecamatan) => (
              <option key={kecamatan} value={kecamatan}>
                {kecamatan}
              </option>
            ))}
          </select>
          {errors.area && <p className="mt-2 text-sm text-red-600">{errors.area}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="address"
            name="address"
            value={getFieldValue(cafeData.address)}
            onChange={handleChange}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
              errors.address ? "border-red-300" : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="Full address"
            required
          />
        </div>
        {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={getFieldValue(cafeData.description)}
          onChange={handleChange}
          className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
            errors.description ? "border-red-300" : "border-gray-300 dark:border-gray-600"
          }`}
          placeholder="Describe the cafe, its atmosphere, and what makes it great for working"
          required
        />
        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">External Links</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                id="website"
                name="website"
                value={getFieldValue(cafeData.website)}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.website ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="https://example.com"
              />
            </div>
            {errors.website && <p className="mt-2 text-sm text-red-600">{errors.website}</p>}
          </div>

          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instagram
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={getFieldValue(cafeData.instagram)}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.instagram ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Instagram handle or URL"
              />
            </div>
            {errors.instagram && <p className="mt-2 text-sm text-red-600">{errors.instagram}</p>}
          </div>

          <div>
            <label htmlFor="link_maps" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google Maps Link
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                id="link_maps"
                name="link_maps"
                value={getFieldValue(cafeData.link_maps)}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.link_maps ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="https://maps.google.com/..."
              />
            </div>
            {errors.link_maps && <p className="mt-2 text-sm text-red-600">{errors.link_maps}</p>}
          </div>

          <div>
            <label htmlFor="menu_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Menu Link
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                id="menu_link"
                name="menu_link"
                value={getFieldValue(cafeData.menu_link)}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.menu_link ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Link to cafe's menu"
              />
            </div>
            {errors.menu_link && <p className="mt-2 text-sm text-red-600">{errors.menu_link}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          checked={Boolean(cafeData.featured)}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="featured" className="ml-3 block text-sm text-gray-900 dark:text-white">
          Featured Cafe (highlighted on homepage)
        </label>
      </div>
    </div>
  );
};

export default BasicInfoTab;

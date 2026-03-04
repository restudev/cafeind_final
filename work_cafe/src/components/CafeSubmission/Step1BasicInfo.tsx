import React from 'react';
import { MapPin, Building, FileText } from 'lucide-react';
import { CafeSubmissionData, AREAS } from '../../types/cafeSubmission';

interface Step1BasicInfoProps {
  data: CafeSubmissionData;
  updateData: (updates: Partial<CafeSubmissionData>) => void;
  errors: Record<string, string>;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ 
  data, 
  updateData, 
  errors 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
  <div className="space-y-6">
    <div className="text-center lg:text-left">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
        <Building className="h-8 w-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
      <p className="text-gray-600">Tell us about the cafe you'd like to recommend</p>
    </div>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cafe Name *</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter the cafe name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter the full address"
          />
        </div>
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Area *</label>
        <select
          value={data.area}
          onChange={(e) => updateData({ area: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.area ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select an area</option>
          {AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
      </div>
    </div>
  </div>
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
      <div className="relative">
        <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <textarea
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          rows={8}
          className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe the cafe's atmosphere, what makes it special, and why you recommend it..."
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        {errors.description ? (
          <p className="text-sm text-red-600">{errors.description}</p>
        ) : (
          <p className="text-sm text-gray-500">Tell us what makes this cafe special</p>
        )}
        <span className="text-sm text-gray-400">{data.description.length}/500</span>
      </div>
    </div>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for a Great Description</h4>
      <ul className="text-sm text-blue-700 space-y-1">
        <li>• Mention the atmosphere and vibe</li>
        <li>• Describe the seating and workspace quality</li>
        <li>• Note any unique features or specialties</li>
        <li>• Share why you personally recommend it</li>
      </ul>
    </div>
  </div>
</div>
  );
};

export default Step1BasicInfo;
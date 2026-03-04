import React from 'react';
import { Settings, Globe, Instagram, Clock, DollarSign, Volume2 } from 'lucide-react';
import { CafeSubmissionData, DEFAULT_AMENITIES, DEFAULT_TAGS } from '../../types/cafeSubmission';
import CustomInput from './CustomInput';

interface Step3CafeDetailsProps {
  data: CafeSubmissionData;
  updateData: (updates: Partial<CafeSubmissionData>) => void;
  errors: Record<string, string>;
}

const Step3CafeDetails: React.FC<Step3CafeDetailsProps> = ({ 
  data, 
  updateData, 
  errors 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cafe Details</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Help others discover what makes this cafe special</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900">Price Range *</label>
              <p className="text-xs text-gray-500">Average cost per person</p>
            </div>
          </div>
          <select
            value={data.price_range}
            onChange={(e) => updateData({ price_range: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm bg-white"
          >
            <option value={1}>💰 Budget-friendly (Under 50k)</option>
            <option value={2}>💳 Moderate (50k - 100k)</option>
            <option value={3}>💎 Premium (Above 100k)</option>
          </select>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Volume2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900">Noise Level *</label>
              <p className="text-xs text-gray-500">Atmosphere and sound level</p>
            </div>
          </div>
          <select
            value={data.noise_level}
            onChange={(e) => updateData({ noise_level: e.target.value as 'Quiet' | 'Moderate' | 'Loud' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
          >
            <option value="Quiet">🤫 Quiet - Perfect for focused work</option>
            <option value="Moderate">💬 Moderate - Good for casual work</option>
            <option value="Loud">🎉 Loud - Better for socializing</option>
          </select>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900">Visit Length *</label>
              <p className="text-xs text-gray-500">How long do people stay?</p>
            </div>
          </div>
          <select
            value={data.avg_visit_length}
            onChange={(e) => updateData({ avg_visit_length: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm bg-white ${
              errors.avg_visit_length ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">⏰ Select visit length</option>
            <option value="1-2 hours">⚡ 1-2 hours</option>
            <option value="2-3 hours">☕ 2-3 hours</option>
            <option value="3-4 hours">📚 3-4 hours</option>
            <option value="4-6 hours">💻 4-6 hours</option>
            <option value="6+ hours">🏠 6+ hours</option>
          </select>
          {errors.avg_visit_length && (
            <p className="mt-1 text-xs text-red-600">{errors.avg_visit_length}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <Clock className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900">Opening Hours *</label>
              <p className="text-xs text-gray-500">When is the cafe open?</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">📅 Weekdays (Mon-Fri)</label>
              <input
                type="text"
                value={data.opening_hours?.weekdays || ''}
                onChange={(e) => updateData({ 
                  opening_hours: { 
                    ...data.opening_hours, 
                    weekdays: e.target.value 
                  } 
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm ${
                  errors['opening_hours.weekdays'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 9:00 AM - 10:00 PM"
              />
              {errors['opening_hours.weekdays'] && (
                <p className="mt-1 text-xs text-red-600">{errors['opening_hours.weekdays']}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">🎉 Weekends (Sat-Sun)</label>
              <input
                type="text"
                value={data.opening_hours?.weekends || ''}
                onChange={(e) => updateData({ 
                  opening_hours: { 
                    ...data.opening_hours, 
                    weekends: e.target.value 
                  } 
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm ${
                  errors['opening_hours.weekends'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 10:00 AM - 8:00 PM"
              />
              {errors['opening_hours.weekends'] && (
                <p className="mt-1 text-xs text-red-600">{errors['opening_hours.weekends']}</p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Globe className="h-4 w-4 text-green-600" />
              </div>
              <label className="block text-sm font-semibold text-gray-900">Website</label>
            </div>
            <input
              type="url"
              value={data.website || ''}
              onChange={(e) => updateData({ website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
              placeholder="https://example.com"
            />
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                <Instagram className="h-4 w-4 text-pink-600" />
              </div>
              <label className="block text-sm font-semibold text-gray-900">Instagram</label>
            </div>
            <input
              type="text"
              value={data.instagram || ''}
              onChange={(e) => updateData({ instagram: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm"
              placeholder="@username or full URL"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <CustomInput
            label="Amenities"
            items={data.amenities || []}
            defaultItems={DEFAULT_AMENITIES}
            onItemsChange={(amenities) => updateData({ amenities })}
            placeholder="e.g., Fast WiFi, Cozy Seating"
            colorScheme="blue"
            maxItems={15}
          />
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <CustomInput
            label="Tags"
            items={data.tags || []}
            defaultItems={DEFAULT_TAGS}
            onItemsChange={(tags) => updateData({ tags })}
            placeholder="e.g., Hipster, Romantic, Business"
            colorScheme="amber"
            maxItems={10}
          />
        </div>
      </div>
    </div>
  );
};

export default Step3CafeDetails;
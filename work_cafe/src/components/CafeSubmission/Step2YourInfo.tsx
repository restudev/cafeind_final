import React from 'react';
import { User, Mail, Phone, Check } from 'lucide-react';
import { CafeSubmissionData } from '../../types/cafeSubmission';

interface Step2YourInfoProps {
  data: CafeSubmissionData;
  updateData: (updates: Partial<CafeSubmissionData>) => void;
  errors: Record<string, string>;
}

const Step2YourInfo: React.FC<Step2YourInfoProps> = ({ 
  data, 
  updateData, 
  errors 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Information</h2>
          <p className="text-gray-600">We need your contact details for verification</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={data.submitter_name}
                onChange={(e) => updateData({ submitter_name: e.target.value })}
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.submitter_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.submitter_name && <p className="mt-1 text-sm text-red-600">{errors.submitter_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={data.submitter_email}
                onChange={(e) => updateData({ submitter_email: e.target.value })}
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.submitter_email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.submitter_email && <p className="mt-1 text-sm text-red-600">{errors.submitter_email}</p>}
            <p className="mt-1 text-sm text-gray-500">We'll use this to contact you about your submission</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={data.submitter_phone || ''}
                onChange={(e) => updateData({ submitter_phone: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your phone number"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">Optional - for faster communication if needed</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-blue-900 mb-2">Privacy Notice</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Your contact information will only be used for verification purposes and will not be shared publicly. We
                may contact you if we need clarification about your cafe recommendation.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-green-900 mb-3">Why We Need This</h4>
          <ul className="text-sm text-green-700 space-y-2">
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>Verify the authenticity of submissions</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>Contact you for additional details if needed</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>Send updates about your submission status</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>Prevent spam and duplicate submissions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step2YourInfo;
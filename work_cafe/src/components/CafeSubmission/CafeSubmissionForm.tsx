import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, Home, Coffee, Star, MapPin } from 'lucide-react';
import StepIndicator from './StepIndicator';
import Step1BasicInfo from './Step1BasicInfo';
import Step2YourInfo from './Step2YourInfo';
import Step3CafeDetails from './Step3CafeDetails';
import Step4Upload from './Step4Upload';
import { CafeSubmissionData, API_BASE_URL } from '../../types/cafeSubmission';

const STEP_TITLES = ['Basic Info', 'Your Info', 'Cafe Details', 'Upload & Notes'];

const CafeSubmissionForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<CafeSubmissionData>({
    name: '',
    address: '',
    area: '',
    description: '',
    submitter_name: '',
    submitter_email: '',
    submitter_phone: '',
    price_range: 1,
    noise_level: 'Moderate',
    avg_visit_length: '',
    opening_hours: {
      weekdays: '',
      weekends: ''
    },
    website: '',
    instagram: '',
    amenities: [],
    tags: [],
    image_urls: [],
    additional_notes: ''
  });

  const updateData = (updates: Partial<CafeSubmissionData>) => {
    setData(prev => ({ ...prev, ...updates }));
    // Clear related errors when data is updated
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!data.name.trim()) newErrors.name = 'Cafe name is required';
        if (!data.address.trim()) newErrors.address = 'Address is required';
        if (!data.area.trim()) newErrors.area = 'Area is required';
        if (!data.description.trim()) newErrors.description = 'Description is required';
        if (data.description.length > 500) newErrors.description = 'Description must be 500 characters or less';
        break;

      case 2:
        if (!data.submitter_name.trim()) newErrors.submitter_name = 'Your name is required';
        if (!data.submitter_email.trim()) newErrors.submitter_email = 'Email is required';
        if (data.submitter_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.submitter_email)) {
          newErrors.submitter_email = 'Please enter a valid email address';
        }
        break;

      case 3:
        if (!data.avg_visit_length.trim()) newErrors.avg_visit_length = 'Average visit length is required';
        if (!data.opening_hours?.weekdays?.trim()) newErrors['opening_hours.weekdays'] = 'Weekday hours are required';
        if (!data.opening_hours?.weekends?.trim()) newErrors['opening_hours.weekends'] = 'Weekend hours are required';
        break;

      case 4:
        // No required fields in step 4
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    setErrors({});

    try {
      const submissionData = {
        ...data,
        isFinal: true,
        submitted_at: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/submit_cafe_request.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Submission failed');
      }

      setSubmitted(true);
    } catch (error) {
      setErrors({ submit: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    // Navigate to home page - adjust this based on your routing setup
    window.location.href = '/';
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for recommending "{data.name}". Our team will review your submission and get back to you soon.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Submit Another Cafe
            </button>
            <button
              onClick={handleBackToHome}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo data={data} updateData={updateData} errors={errors} />;
      case 2:
        return <Step2YourInfo data={data} updateData={updateData} errors={errors} />;
      case 3:
        return <Step3CafeDetails data={data} updateData={updateData} errors={errors} />;
      case 4:
        return <Step4Upload data={data} updateData={updateData} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="relative">
          {/* Back to Home Button */}
          <button
            onClick={handleBackToHome}
            className="absolute left-0 top-0 flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-all duration-200"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </button>

          {/* Main Header Content */}
          <div className="text-center mb-8 pt-12">
            {/* Icon Section */}
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                  <Coffee className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Star className="h-4 w-4 text-yellow-700 fill-current" />
                </div>
                <div className="absolute -bottom-1 -left-2 w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center shadow-md transform -rotate-12">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
                Recommend a Cafe
              </h1>
              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Share your favorite workspace gem with our community
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Help fellow digital nomads and remote workers discover amazing places to work, meet, and create
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center items-center mt-6 space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step Indicator */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <StepIndicator 
              currentStep={currentStep} 
              totalSteps={4} 
              stepTitles={STEP_TITLES}
            />
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {renderStep()}

            {/* Submit Error */}
            {errors.submit && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of 4
            </div>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Submit Recommendation
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeSubmissionForm;
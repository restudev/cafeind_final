import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, Home, Coffee, Star } from 'lucide-react';
// Removed unused StepIndicator import
import Step1BasicInfo from '../components/CafeSubmission/Step1BasicInfo';
import Step2YourInfo from '../components/CafeSubmission/Step2YourInfo';
import Step3CafeDetails from '../components/CafeSubmission/Step3CafeDetails';
import Step4Upload from '../components/CafeSubmission/Step4Upload';
import { CafeSubmissionData, API_BASE_URL } from '../types/cafeSubmission';

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
    window.location.href = '/';
  };

  // Moved useMemo to the top level of the component
  const stepIndicator = useMemo(
    () => (
      <div className="flex items-center justify-center space-x-8 mb-8">
        {STEP_TITLES.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex items-center space-x-3">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                    ${isCompleted ? 'bg-green-500 text-white shadow-lg' : isCurrent ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-600'}
                  `}
                >
                  {isCompleted ? <Check className="h-6 w-6" /> : stepNumber}
                </div>
                <span
                  className={`
                    text-sm font-medium
                    ${isCurrent ? 'text-blue-600' : 'text-gray-500'}
                  `}
                >
                  {title}
                </span>
              </div>
              {index < 3 && (
                <div
                  className={`
                    w-16 h-0.5 transition-all duration-200
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    ),
    [currentStep]
  );

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </button>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Star className="h-2.5 w-2.5 text-yellow-700 fill-current" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Recommend a Cafe</h1>
                <p className="text-sm text-gray-600">Share your favorite Cafe</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Step {currentStep} of 4</div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {stepIndicator}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
          <div className="p-8">{renderStep()}</div>
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
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
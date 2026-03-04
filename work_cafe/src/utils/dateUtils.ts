// Centralized date utilities for consistent date handling across components

/**
 * Parse various date formats and return a proper Date object
 * Handles: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, ISO strings
 */
export const parseDate = (dateString: string | null): Date | null => {
  if (!dateString) return null;

  try {
    // Handle YYYY-MM-DD format (database format)
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Set to end of day (23:59:59) in local timezone
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day, 23, 59, 59);
    }
    
    // Handle ISO format (YYYY-MM-DDTHH:MM:SS)
    if (dateString.includes('T')) {
      return new Date(dateString);
    }
    
    // Handle DD/MM/YYYY format
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day, 23, 59, 59);
    }
    
    // Handle MM/DD/YYYY format (assume if first part <= 12)
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const parts = dateString.split('/').map(Number);
      if (parts[0] <= 12) {
        return new Date(parts[2], parts[0] - 1, parts[1], 23, 59, 59);
      }
    }
    
    // Fallback: try native Date parsing
    const fallbackDate = new Date(dateString);
    if (!isNaN(fallbackDate.getTime())) {
      return fallbackDate;
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Format date for display (e.g., "January 1, 2025")
 */
export const formatDisplayDate = (dateString: string | null): string => {
  if (!dateString) return "Not set";
  
  const date = parseDate(dateString);
  if (!date || isNaN(date.getTime())) return "Invalid date";
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Convert date to YYYY-MM-DD format for input fields
 */
export const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return "";
  
  // If already in YYYY-MM-DD format, return as is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  
  const date = parseDate(dateString);
  if (!date || isNaN(date.getTime())) return "";
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Convert date to YYYY-MM-DD format for API submission
 * This ensures we always send the correct format to the backend
 */
export const formatDateForAPI = (dateString: string | null): string => {
  if (!dateString) return "";
  
  // If already in YYYY-MM-DD format, return as is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  
  // Parse other formats and convert to YYYY-MM-DD
  const date = parseDate(dateString);
  if (!date || isNaN(date.getTime())) return "";
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Normalize any date format to YYYY-MM-DD format
 * This is the key function to prevent the ISO date format error
 */
export const normalizeDate = (dateString: string | null): string => {
  if (!dateString) return "";
  
  // If already in YYYY-MM-DD format, return as is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  
  // Handle ISO format (remove time and timezone info)
  if (dateString.includes('T')) {
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) {
      const year = isoDate.getFullYear();
      const month = (isoDate.getMonth() + 1).toString().padStart(2, '0');
      const day = isoDate.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  // Parse other formats and convert to YYYY-MM-DD
  const date = parseDate(dateString);
  if (!date || isNaN(date.getTime())) return "";
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a date string is valid YYYY-MM-DD format
 */
export const isValidDateString = (date: string | null): boolean => {
  if (!date) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day &&
    !isNaN(d.getTime())
  );
};

/**
 * Calculate time remaining until a target date
 */
export const calculateTimeLeft = (endDate: string | null): { 
  days: number; 
  hours: number; 
  minutes: number; 
  seconds: number;
  isExpired: boolean;
} => {
  const targetDate = parseDate(endDate);
  
  if (!targetDate || isNaN(targetDate.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
};

/**
 * Check if a promotion is expired
 */
export const isPromoExpired = (validUntil: string | null): boolean => {
  if (!validUntil) return true;
  
  const targetDate = parseDate(validUntil);
  if (!targetDate || isNaN(targetDate.getTime())) return true;
  
  const now = new Date();
  return now > targetDate;
};
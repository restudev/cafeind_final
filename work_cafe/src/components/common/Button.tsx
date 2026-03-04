import React, { ButtonHTMLAttributes } from 'react';
import { Coffee, Search, MapPin, Wifi, Map } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconType = 'coffee' | 'search' | 'map-pin' | 'wifi' | 'map' | null;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode | IconType; // Support both ReactNode and specific lucide icons
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-800 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500',
    info: 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-500',
    outline: 'bg-transparent border-2 border-blue-700 text-blue-700 hover:bg-blue-50 focus:ring-gray-500',
    text: 'bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-400',
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const iconMap = {
    coffee: <Coffee className={iconPosition === 'left' ? 'mr-2' : 'ml-2'} size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />,
    search: <Search className={iconPosition === 'left' ? 'mr-2' : 'ml-2'} size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />,
    'map-pin': <MapPin className={iconPosition === 'left' ? 'mr-2' : 'ml-2'} size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />,
    wifi: <Wifi className={iconPosition === 'left' ? 'mr-2' : 'ml-2'} size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />,
    map: <Map className={iconPosition === 'left' ? 'mr-2' : 'ml-2'} size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />,
  };

  const disabledClasses = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';
  const widthClasses = fullWidth ? 'w-full' : '';

  // Determine the icon to render with type assertion
  const renderIcon = typeof icon === 'string' && icon !== null ? iconMap[icon as keyof typeof iconMap] : icon;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <svg
          className={`animate-spin ${iconPosition === 'left' ? '-ml-1 mr-2' : 'ml-2 mr-1'} h-4 w-4`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {!isLoading && renderIcon && iconPosition === 'left' && <span>{renderIcon}</span>}
      {children}
      {!isLoading && renderIcon && iconPosition === 'right' && <span>{renderIcon}</span>}
    </button>
  );
};

export default Button;
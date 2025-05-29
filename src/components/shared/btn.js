// src/components/IconButton.jsx
import { HomeIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

// Map Tailwind color classes to ensure proper purging
const colorClasses = {
  blue: {
    500: 'bg-blue-500',
    600: 'hover:bg-blue-600',
    400: 'focus:ring-blue-400',
  },
  red: {
    500: 'bg-red-500',
    600: 'hover:bg-red-600',
    400: 'focus:ring-red-400',
  },
  green: {
    500: 'bg-green-500',
    600: 'hover:bg-green-600',
    400: 'focus:ring-green-400',
  },
};

function IconButton({ btnColor, btnShade, textColor, hoverShade, focusShade, onClick, icon: Icon, name , path}) {
  
  const navigate = useNavigate();

  const handleClick = () => {
    if (path && !onClick) {
      navigate(path); // Navigate to the specified path
    } else if (onClick) {
      onClick(); // Execute custom onClick if provided
    }
  };
  
  // Construct Tailwind classes safely
  const bgClass = colorClasses[btnColor]?.[btnShade] || 'bg-gray-500';
  const hoverClass = colorClasses[btnColor]?.[hoverShade] || 'hover:bg-gray-600';
  const focusClass = colorClasses[btnColor]?.[focusShade] || 'focus:ring-gray-400';
  const textClass = `text-${textColor || 'white'}`;

  return (
    <div className="relative">
      <button
        className={`p-2 ${bgClass} ${textClass} rounded-full ${hoverClass} focus:outline-none focus:ring-2 ${focusClass} focus:ring-opacity-75`}
        onClick={handleClick}
        aria-label={name || 'Button'}
      >
        {Icon ? <Icon className="h-6 w-6" /> : name}
      </button>
    </div>
  );
}

export default IconButton;
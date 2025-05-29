/* 1) run this command: npm install @heroicons/react */

// src/components/IconButton.jsx
import { HomeIcon } from '@heroicons/react/24/solid'; // Solid icon from Heroicons

function IconButton() {
  return (
    <div className="relative group">
        <button
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        aria-label="Home"
        >
        <HomeIcon className="h-6 w-6" />
        {/* hello */}
        </button>
        {/* <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2">
            Home
        </span> */}
    </div>
  );
}

export default IconButton;
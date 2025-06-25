import React from 'react';
{/*[OKS] you can enhance design*/}
const PharmaCapsuleLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
      <div className="flex flex-col items-center justify-center">
        {/* Square background behind the capsule icon */}
        <div className="w-24 h-24 bg-white shadow-md rounded-xl flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-16 h-16 animate-spin"
          >
            <g id="_x30_4">
              <path
                fill="#3a6ea5"
                d="M23,16v6.73c0,2.75-1.47,5.14-3.64,6.37c-0.03,0.02-0.05,0.03-0.08,0.04C18.3,29.69,17.19,30,16,30c-0.34,0-0.67-0.03-1-0.09c-3.39-0.49-6-3.52-6-7.18V16H23z"
              />
              <path
                fill="#ebebeb"
                d="M23,9.27V16H9V9.27c0-3.66,2.61-6.69,6-7.18C15.33,2.03,15.66,2,16,2c1.19,0,2.3,0.31,3.28,0.86c0.03,0.01,0.05,0.02,0.08,0.04C21.53,4.13,23,6.52,23,9.27z"
              />
              <path
                fill="#004e98"
                d="M21,16v7.69c0,2.08-0.65,3.99-1.72,5.45C18.3,29.69,17.19,30,16,30c-0.34,0-0.67-0.03-1-0.09c-3.39-0.49-6-3.52-6-7.18V16H21z"
              />
              <path
                fill="silver"
                d="M21,8.31V16H9V9.27c0-3.66,2.61-6.69,6-7.18C15.33,2.03,15.66,2,16,2c1.19,0,2.3,0.31,3.28,0.86C20.35,4.32,21,6.23,21,8.31z"
              />
            </g>
          </svg>
        </div>

        <p className="mt-4 text-gray-500 text-sm font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default PharmaCapsuleLoader;

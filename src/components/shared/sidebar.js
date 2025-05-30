 {/* [OKS *0-0*]  sidebar >*/}

import React from "react";

const Sidebar = ({}) => (
  <div className="w-full lg:w-1/4 bg-gray-100 p-4 rounded text-blue-500">
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm text-center">
      <h5 className="font-semibold mb-3">Our Pharmacy</h5>
      <div className="flex flex-col items-center">

        {/* [OKS *0-0*]  static pharmacy image  >*/}
        <img 
          src="https://static.vecteezy.com/system/resources/previews/011/954/994/non_2x/pharmacy-logo-design-medical-logo-vector.jpg" 
          alt="Pharmacy Logo"
          className="w-20 h-20 object-contain rounded-full border-2 border-blue-200 mb-3"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80?text=Pharmacy';
            e.target.className = 'w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xs mb-3';
          }}
        />
        <h4 className="font-bold text-lg text-blue-800">City Pharmacy</h4>
      </div>
    </div>

    <div className="mb-6">
      <h5 className="font-semibold mb-3">Price Range</h5>
      <div className="flex gap-2">
        <input
          type="number"
          className="w-1/2 border px-2 py-1 rounded"
          placeholder="Min"
         
        />
        <input
          type="number"
          className="w-1/2 border px-2 py-1 rounded"
          placeholder="Max"

        />
      </div>
    </div>


    <div>
      <h5 className="font-semibold mb-3">Product Categories</h5>
      <div className="space-y-2">
      
      </div>
    </div>
  </div>
);

export default Sidebar;
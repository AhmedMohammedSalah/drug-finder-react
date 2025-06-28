import React from 'react';

const MedicalLoadingComponent = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
        {/* Circular glow with soft edges */}
        <div 
          className="absolute inset-0 bg-white/90"
          style={{
            maskImage: 'radial-gradient(circle, white 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle, white 40%, transparent 80%)',
            boxShadow: '0 0 30px 15px rgba(255, 255, 255, 0.7)'
          }}
        ></div>
        
        {/* Circular mask for the GIF */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-contain">
          <div className="relative w-[500px] h-[500px] rounded-full overflow-contain">
            <img
              src='newloading.gif'
              alt="Loading"
              className="w-full h-full object-contain"
              style={{
                borderRadius: '50%',
                backgroundColor: 'white',
              }}
            />
          </div>
        </div>
    </div>
  );
};

export default MedicalLoadingComponent;
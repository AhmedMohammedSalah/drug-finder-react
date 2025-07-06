export const SharedLoadingComponent = ({
  loadingText = "Please wait...",
  subText = "This won't take long...",
  gif = "/defaultLoading.gif",
  color = "blue",
  gifWidth = "100%" 
}) => {
  const textColor = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600"
  }[color] || "text-blue-600";

  const subTextColor = {
    blue: "text-blue-500/90",
    purple: "text-purple-500/90",
    green: "text-green-500/90"
  }[color] || "text-blue-500/90";

  return (
    <div className="fixed inset-0 flex z-[9999]">
      {/* Spacer for sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0"></div>

      {/* Overlay */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
          
          {/* Animated image container */}
          <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] mb-4">
            <div 
              className="absolute inset-0 rounded-full bg-white/40 blur-2xl"
              style={{
                boxShadow: '0 0 40px 20px rgba(255, 255, 255, 0.4)',
                animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
            <div 
              className="relative z-10 w-full h-full flex items-center justify-center"
              style={{
                animation: 'bounce 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            >
              <img
                src={gif}
                alt="Loading..."
                className="h-full object-contain" // Removed w-full here
                style={{
                  width: gifWidth, // Use the gifWidth prop
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))',
                  transform: 'translateX(-8px)'
                }}
              />
            </div>
          </div>

          {/* Loading Text */}
          <div 
            className="text-center transform translate-x-[-10px] w-full max-w-[90%] px-4 py-3 rounded-lg bg-white/30 mt-2"
            style={{ backdropFilter: 'blur(4px)' }}
          >
            <p className={`${textColor} text-2xl md:text-3xl font-medium`}>
              {loadingText}
            </p>
            <p className={`${subTextColor} text-base md:text-lg mt-2`}>
              {subText}
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-12px) scale(1.03); }
          }
        `
      }} />
    </div>
  );
};

export default SharedLoadingComponent;

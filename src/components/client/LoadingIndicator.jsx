const LoadingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white/20 border border-white/30 rounded-xl px-4 py-3 shadow-lg backdrop-blur-md">
        <div className="flex space-x-3">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
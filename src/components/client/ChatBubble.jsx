const ChatBubble = ({ message, onViewPharmacies }) => {
  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} transition-all duration-300`}>
      <div 
        className={`max-w-xs md:max-w-md rounded-xl px-4 py-3 backdrop-blur-md ${
          message.isBot 
            ? 'bg-white/20 border border-white/30 text-white' 
            : 'bg-blue-500/70 text-white'
        } shadow-lg transition-all duration-300`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        {message.hasResults && (
          <button
            onClick={() => onViewPharmacies(message.searchTerm)}
            className="mt-2 px-4 py-2 bg-blue-600/90 hover:bg-blue-700/90 text-white rounded-lg transition-all duration-300 shadow-md hover:scale-105"
          >
            Show Pharmacies
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
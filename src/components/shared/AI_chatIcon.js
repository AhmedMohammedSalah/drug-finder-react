import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const ChatIcon = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/chat")}
      className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
      title="Open AI Chat"
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default ChatIcon;
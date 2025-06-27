import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { Copy, Send, Loader2, X ,Bot } from "lucide-react";

const ChatBox = ({ onClose }) => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored) setChatHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const userMsg = { sender: "user", text: question };
    setChatHistory((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      const response = await api.aiChat.ask(question);
      const aiMsg = {
        sender: "ai",
        text: response.data.answer || response.data,
      };
      setChatHistory((prev) => [...prev, aiMsg]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
        {/* Left side: icon and title */}
          <div className="flex items-center space-x-2">
    <button onClick={clearChat} className="text-sm text-blue-500 hover:underline">Clear</button>
    <button onClick={onClose} className="text-gray-400 hover:text-red-400">
      <X size={18} />
    </button>
  </div>
 <div className="flex items-center space-x-2">
        <Bot size={20} className="text-blue-100" />
        <span className="font-medium text-blue-600 text-sm">AI Assistant</span>
      </div>
  {/* Right side: buttons */}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
            <div className="bg-blue-50 p-3 rounded-full mb-2">
              <Send className="text-blue-400" size={24} />
            </div>
            <h3 className="font-medium text-gray-600">How can I help you today?</h3>
            <p className="text-sm mt-1 text-gray-400">
              Ask your question and I'll respond as soon as possible.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`relative max-w-[85%] px-4 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sender === "ai" && (
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                      className="absolute -bottom-2 -left-2 bg-white p-1 rounded-full shadow border border-gray-200 hover:bg-gray-50 transition-colors"
                      aria-label="Copy message"
                    >
                      <Copy size={12} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-lg rounded-bl-none border border-gray-200 max-w-[85%] text-sm text-gray-500 flex items-center space-x-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Generating response...</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Field */}
      <div className="p-2 border-t border-gray-200 bg-white">
        <div className="relative flex items-center">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder="Type your message..."
            className="w-full p-2 pr-10 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !question.trim()}
            className={`absolute right-2 p-1 rounded-full ${
              loading || !question.trim() ? "text-gray-400" : "text-blue-600 hover:text-blue-700"
            }`}
            aria-label="Send message"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

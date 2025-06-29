import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { Copy, Send, Loader2, X, Bot, MoreHorizontal, ArrowLeft, Minus, MessageSquare } from "lucide-react";

const ChatBox = ({ onClose }) => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const bottomRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored) {
      const parsedHistory = JSON.parse(stored);
      setChatHistory(parsedHistory);
      setShowWelcome(parsedHistory.length === 0);
    } else {
      // Initialize with welcome message when no stored history
      initializeWelcomeMessage();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const initializeWelcomeMessage = () => {
    const welcomeMsg = {
      sender: "ai",
      text: "Hello there! It's nice to meet you! How can I help you today?",
      isWelcome: true
    };
    setChatHistory([welcomeMsg]);
    setShowWelcome(true);
  };

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setShowWelcome(false);
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

  const startNewChat = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
    setShowWelcome(true);
    // Add a small delay to show the transition, then initialize welcome message
    setTimeout(() => {
      initializeWelcomeMessage();
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </button>
          <button 
            onClick={startNewChat}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
            title="Start new chat"
          >
            <MessageSquare size={16} />
            <span className="text-sm">New Chat</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot size={14} className="text-white" />
          </div>
          <span className="text-blue-600 font-medium text-sm">ChatBot</span>
        </div>
        
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <Minus size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Bot size={32} className="text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-800">Welcome to ChatBot</h3>
                <p className="text-gray-500 text-sm">Start a conversation by typing a message below</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "items-start space-x-3"}`}>
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`relative max-w-[280px] px-4 py-3 text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sender === "ai" && (
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                      className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                      aria-label="Copy message"
                    >
                      <Copy size={12} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[280px] text-sm text-gray-500 flex items-center space-x-2">
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
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder="Write a message..."
            className="w-full pl-4 pr-12 py-3 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <div className="absolute right-3 flex items-center space-x-2">
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-lg">😊</span>
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !question.trim()}
              className={`p-1.5 rounded-full ${
                loading || !question.trim() 
                  ? "text-gray-400" 
                  : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              aria-label="Send message"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={18} />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center mt-3">
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <span>Powered by</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                <Bot size={10} className="text-white" />
              </div>
              <span className="font-medium">ChatBot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
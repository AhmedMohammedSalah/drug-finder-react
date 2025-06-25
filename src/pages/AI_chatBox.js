import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { Copy, Send, Trash2, User, Bot, MessageCircle, Plus } from "lucide-react";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const storedConversations = localStorage.getItem("chatConversations");
    if (storedConversations) {
      const parsed = JSON.parse(storedConversations);
      setConversations(parsed);
      
      // If there are conversations but no active one, select the most recent
      if (parsed.length > 0 && !currentConversationId) {
        setCurrentConversationId(parsed[0].id);
        setChatHistory(parsed[0].messages);
      }
    }
  }, []);

  // Save conversations to localStorage when they change
  useEffect(() => {
    localStorage.setItem("chatConversations", JSON.stringify(conversations));
  }, [conversations]);

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");

    const userMessage = { sender: "user", text: question, timestamp: new Date().toISOString() };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);

    try {
      const response = await api.aiChat.ask(question);
      const aiMessage = { 
        sender: "ai", 
        text: response.data.answer || response.data,
        timestamp: new Date().toISOString()
      };
      
      const finalHistory = [...updatedHistory, aiMessage];
      setChatHistory(finalHistory);

      // Update or create conversation
      if (currentConversationId) {
        updateConversation(currentConversationId, finalHistory);
      } else {
        createNewConversation(finalHistory);
      }
      
      setQuestion("");
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = (initialMessages = []) => {
    const newConversation = {
      id: Date.now().toString(),
      title: initialMessages[0]?.text.substring(0, 30) || "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: initialMessages
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setChatHistory(initialMessages);
  };

  const updateConversation = (id, messages) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === id) {
        return {
          ...conv,
          title: messages[0]?.text.substring(0, 30) || conv.title,
          updatedAt: new Date().toISOString(),
          messages
        };
      }
      return conv;
    }));
  };

  const selectConversation = (id) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversationId(id);
      setChatHistory(conversation.messages);
    }
  };

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      setConversations(prev => prev.filter(c => c.id !== id));
      
      if (currentConversationId === id) {
        if (conversations.length > 1) {
          // Select another conversation
          const remaining = conversations.filter(c => c.id !== id);
          selectConversation(remaining[0].id);
        } else {
          // No conversations left
          setCurrentConversationId(null);
          setChatHistory([]);
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => createNewConversation()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
              Recent Conversations
            </h3>
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-500 px-2 py-1">No conversations yet</p>
            ) : (
              <div className="space-y-1">
                {conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => selectConversation(conversation.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                      currentConversationId === conversation.id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="truncate flex-1">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(conversation.updatedAt)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteConversation(conversation.id, e)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 border-b flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {conversations.find(c => c.id === currentConversationId)?.title || "New Chat"}
          </h1>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto py-6 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-6">
            {chatHistory.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Bot size={48} className="text-indigo-400 mb-4" />
                <h2 className="text-xl font-medium text-gray-700 mb-2">How can I help you today?</h2>
                <p className="text-gray-500 max-w-md">
                  Start a new conversation by typing your message below.
                </p>
              </div>
            )}

            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-3xl ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      msg.sender === "ai" ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {msg.sender === "ai" ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div
                    className={`mx-3 px-4 py-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {formatDate(msg.timestamp)}
                    </div>
                    {msg.sender === "ai" && (
                      <button
                        onClick={() => handleCopy(msg.text)}
                        className={`mt-1 flex items-center text-xs ${
                          msg.sender === "ai" ? "text-indigo-400 hover:text-indigo-600" : ""
                        }`}
                      >
                        <Copy size={12} className="mr-1" /> Copy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="mx-3 px-4 py-3 bg-white border border-gray-200 text-gray-800 rounded-lg rounded-tl-none shadow-xs">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t py-4 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                rows="1"
                className="w-full p-4 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Type your message..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !question.trim()}
                className={`absolute right-3 bottom-3 p-2 rounded-full ${
                  loading || !question.trim()
                    ? "text-gray-400"
                    : "text-white bg-indigo-600 hover:bg-indigo-700"
                } transition-colors`}
              >
                <Send size={18} />
              </button>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
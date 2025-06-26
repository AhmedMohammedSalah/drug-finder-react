import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrugFinderSearchBar from '../components/client/DrugFinderSearchBar';
import { Pill, MessageSquare } from 'lucide-react';
import apiEndpoints from '../services/api';

const MedicineSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! What medicine are you looking for today?", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setMessages(prev => [...prev, { text: query, isBot: false }]);
    setIsLoading(true);
    
    try {
      const response = await apiEndpoints.pharmacies.findPharmaciesWithMedicine(query);
      
      if (response.data && response.data.length > 0) {
        setMessages(prev => [
          ...prev, 
          { 
            text: `I found ${response.data.length} pharmacies that have ${query}. Would you like to see them?`, 
            isBot: true,
            hasResults: true,
            searchTerm: query
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            text: `I couldn't find any pharmacies with ${query}. Try another medicine?`, 
            isBot: true,
            hasResults: false
          }
        ]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessages(prev => [
        ...prev, 
        { 
          text: `Sorry, there was an error searching for ${query}. Please try again.`, 
          isBot: true,
          hasResults: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPharmacies = (searchTerm) => {
    navigate(`/client/PharmacyMapPage?medicine=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-3">
            <Pill className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Drug Finder</h1>
          </div>
          <p className="text-gray-600">Find pharmacies that carry your needed medications</p>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-3 ${
                  message.isBot 
                    ? 'bg-white border border-gray-200 text-gray-800' 
                    : 'bg-blue-600 text-white'
                } shadow-sm`}
              >
                <p>{message.text}</p>
                {message.hasResults && (
                  <button
                    onClick={() => handleViewPharmacies(message.searchTerm)}
                    className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                  >
                    Show Pharmacies
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <DrugFinderSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
            placeholder="Search for medicines (e.g. Panadol, Aspirin)"
          />
        </div>
      </div>
    </div>
  );
};

export default MedicineSearchPage;
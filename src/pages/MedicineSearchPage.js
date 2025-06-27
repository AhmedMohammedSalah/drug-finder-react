import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrugFinderSearchBar from '../components/client/DrugFinderSearchBar';
import apiEndpoints from '../services/api';
import EarthBackground from '../components/client/EarthBackground';
import Header from '../components/client/Header';
import ChatBubble from '../components/client/ChatBubble';
import LoadingIndicator from '../components/client/LoadingIndicator';

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
    <div className="min-h-screen bg-gradient-to-b from-[#050A30] to-[#0B1D51] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <EarthBackground />
      
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full relative z-10">
        <Header />
        
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[400px] pr-2">
          {messages.map((message, index) => (
            <ChatBubble 
              key={index}
              message={message}
              onViewPharmacies={handleViewPharmacies}
            />
          ))}
          
          {isLoading && <LoadingIndicator />}
        </div>

        <div className="bg-white/20 p-4 rounded-xl shadow-xl
         border border-white/30 backdrop-blur-md">
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
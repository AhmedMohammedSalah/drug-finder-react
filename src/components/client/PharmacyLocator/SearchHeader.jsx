import { Pill } from 'lucide-react';
import DrugFinderSearchBar from '../../client/DrugFinderSearchBar';

const SearchHeader = ({ 
  searchTerm, 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit, 
  medicines, 
  isSearching,
  onShowMedicinePopup 
}) => {
  return (
    <div className="text-center mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {searchTerm ? `Search Results for "${searchTerm}"` : 'Find Nearby Pharmacies'}
      </h1>
      
      <div className="max-w-2xl mx-auto mt-4">
        <DrugFinderSearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          placeholder="Search for medicines in pharmacies..."
        />
      </div>
      
      {isSearching && medicines.length > 0 && (
        <button 
          onClick={onShowMedicinePopup}
          className="mt-2 inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Pill className="h-4 w-4 mr-1" />
          Show {medicines.length} available medicines
        </button>
      )}
    </div>
  );
};

export default SearchHeader;
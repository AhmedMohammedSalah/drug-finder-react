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
    </div>
  );
};

export default SearchHeader;
import { Pill } from 'lucide-react';

const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center mb-3">
        <Pill className="h-10 w-10 text-blue-400 mr-3" />
        <h1 className="text-4xl font-bold text-white">
          Drug Finder
        </h1>
      </div>
      <p className="text-gray-300">Find pharmacies that carry your needed medications</p>
    </div>
  );
};

export default Header;
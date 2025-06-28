import React from 'react';
import { Clock, FileText, ShieldAlert } from 'lucide-react';

const PendingLicenseCard = () => {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 shadow-lg rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
      {/* Text Content - Now on the right side */}
      <div className="w-full md:w-2/3 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-yellow-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-800">
            License Under Review
          </h2>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-700 text-lg">
            Our team is currently reviewing your pharmacy license documents. This process typically takes 2-3 business days.
          </p>
        </div>
        
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-700 text-lg">
            You'll gain full access to medicine management features once your license is approved.
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-200/50 rounded-lg border border-yellow-300">
          <p className="text-yellow-800 font-medium">
            Need help? Contact our support team at support@pharmacyapp.com
          </p>
        </div>
      </div>

      {/* Image - Now on the left side */}
      <div className="w-full md:w-1/3 flex justify-center">
        <img 
          src="/docRevise.PNG" 
          alt="Document review in progress" 
          className="w-full max-w-[300px] md:max-w-[400px] mx-auto animate-float"
        />
      </div>
    </div>
  );
};

export default PendingLicenseCard;
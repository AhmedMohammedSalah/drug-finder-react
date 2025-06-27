import React from 'react';
import { FileText, AlertCircle, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// Rejected License Card (Red)
export const RejectedLicenseCard = ({ adminMessage, appealLink }) => {
    const navigate = useNavigate();
  
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 shadow-lg rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
        {/* Text Content */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-red-800">
              License Application Rejected
            </h2>
          </div>
          
          {/* Admin Message */}
          {adminMessage && (
            <div className="mt-4 p-4 bg-red-200/50 rounded-lg border border-red-300">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800">Admin Message:</h3>
                  <p className="text-red-700">{adminMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-lg">
              Please review the reasons for rejection and submit additional documents if needed.
            </p>
          </div>
          
          {/* Action Button */}
          <button
            onClick={() => navigate(appealLink || '/license-appeal')}
            className="mt-4 flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <span>Submit Appeal</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
  
        {/* Image */}
        <div className="w-full md:w-1/3 flex justify-center">
          <img 
            src="/docFoundError22.png" 
            alt="License rejected" 
            className="w-full max-w-[300px] md:max-w-[400px] mx-auto"
          />
        </div>
      </div>
    );
  };

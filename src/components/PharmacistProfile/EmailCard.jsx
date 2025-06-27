import React from 'react';
import { Mail } from 'lucide-react';

const EmailCard = ({ email }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow">
      <div className="flex items-center gap-3">
        <Mail className="w-5 h-5 text-blue-600" />
        <div>
          <h3 className="text-sm font-semibold text-blue-800">Email Address</h3>
          <p className="text-blue-700 text-sm">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailCard;
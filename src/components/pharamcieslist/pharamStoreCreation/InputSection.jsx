// 📦 components/InputSection.jsx
import { Building2, MapPin, Phone, FileText, AlertCircle } from 'lucide-react';
import React from 'react';

const ErrorIcon = () => (
  <AlertCircle className="absolute right-3 top-3.5 text-red-500 w-5 h-5" />
);

const InputField = ({ icon: Icon, value, onChange, label, placeholder, error, isSubmitted }) => (
  <div className="relative">
    {Icon && <Icon className="absolute top-3 left-3 text-gray-400" size={20} />}
    {isSubmitted ? (
      <div className="pl-10 py-3">{value}</div>
    ) : (
      <>
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full p-3 pl-10 pr-10 border rounded peer placeholder-transparent ${
            error ? 'border-red-500' : ''
          }`}
          value={value}
          onChange={onChange}
        />
        <label className="absolute left-10 top-1 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">
          {label}
        </label>
        {error && <ErrorIcon />}
        {error && <p className="text-red-500 text-xs mt-1 pl-2">{error}</p>}
      </>
    )}
  </div>
);

const TextAreaField = ({ value, onChange, error, isSubmitted }) => (
  <div className="relative">
    <FileText className="absolute top-3 left-3 text-gray-400" size={20} />
    {isSubmitted ? (
      <div className="pl-10 py-3 whitespace-pre-wrap text-gray-700">{value}</div>
    ) : (
      <>
        <textarea
          placeholder="Description"
          className={`w-full p-3 pl-10 pr-10 border rounded resize-none peer placeholder-transparent ${
            error ? 'border-red-500' : ''
          }`}
          style={{ height: '240px' }}
          value={value}
          onChange={onChange}
        />
        <label className="absolute left-10 top-1 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">
          Description
        </label>
        {error && <ErrorIcon />}
        {error && <p className="text-red-500 text-xs mt-1 pl-2">{error}</p>}
      </>
    )}
  </div>
);

const InputSection = ({
  isSubmitted,
  storeName, setStoreName,
  address, setAddress,
  phone, setPhone,
  description, setDescription,
  errors = {},
}) => (
  <>
    <InputField
      icon={Building2}
      value={storeName}
      onChange={(e) => setStoreName(e.target.value)}
      label="Store name"
      placeholder="Store name"
      error={errors.storeName}
      isSubmitted={isSubmitted}
    />
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-1/2">
        <InputField
          icon={MapPin}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          label="Address"
          placeholder="Address"
          error={errors.address}
          isSubmitted={isSubmitted}
        />
      </div>
      <div className="w-full sm:w-1/2">
        <InputField
          icon={Phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          label="Phone"
          placeholder="Phone"
          error={errors.phone}
          isSubmitted={isSubmitted}
        />
      </div>
    </div>
    <TextAreaField
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      error={errors.description}
      isSubmitted={isSubmitted}
    />
  </>
);

export default InputSection;

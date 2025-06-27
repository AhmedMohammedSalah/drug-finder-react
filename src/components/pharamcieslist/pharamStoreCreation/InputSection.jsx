// 📦 components/InputSection.jsx
import { MapPin, Phone, FileText, AlertCircle, Clock } from 'lucide-react';
import React from 'react';

const ErrorIcon = () => (
  <AlertCircle className="absolute right-3 top-3.5 text-red-500 w-5 h-5" />
);

const InputField = ({ icon: Icon, value, onChange, label, placeholder, error, isSubmitted, isHeader = false }) => (
  <div className="relative">
    {Icon && <Icon className="absolute top-3 left-3 text-gray-400" size={20} />}

    {isSubmitted ? (
      isHeader ? (
        <h1 className="text-4xl font-semibold text-gray-800 pl-2">{value}</h1>
      ) : (
        <div className="bg-gray-50 border rounded p-4 pl-14 text-gray-800 shadow-sm relative">
          {Icon && <Icon className="absolute top-4 left-4 text-blue-500" size={24} />}
          <span className="block">{value}</span>
        </div>
      )
    ) : (
      <>
        <input
          type={label.toLowerCase().includes('time') ? 'time' : 'text'}
          placeholder={placeholder}
          className={`w-full p-3 pl-10 pr-10 border rounded peer placeholder-transparent ${
            error ? 'border-red-500' : ''
          } ${isHeader ? 'text-2xl font-semibold' : ''}`}
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
      <div className="bg-gray-50 border rounded p-4 pl-14 text-gray-800 shadow-sm whitespace-pre-wrap break-words relative">
        <FileText className="absolute top-4 left-4 text-blue-500" size={24} />
        {value}
      </div>
    ) : (
      <>
        <textarea
          placeholder="Description"
          className={`w-full p-3 pl-10 pr-10 border rounded resize-y peer placeholder-transparent overflow-auto min-h-[120px] max-h-[300px] ${
            error ? 'border-red-500' : ''
          }`}
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

// ===================== INPUT SECTION =====================

const InputSection = ({
  isSubmitted,
  storeName, setStoreName,
  address, setAddress,
  phone, setPhone,
  startTime, setStartTime,
  endTime, setEndTime,
  description, setDescription,
  errors = {},
}) => (
  <div className="space-y-4">
    {/* Store name as header */}
    <InputField
      value={storeName}
      onChange={setStoreName ? (e) => setStoreName(e.target.value) : undefined}
      label="Store name"
      placeholder="Store name"
      error={errors.storeName}
      isSubmitted={isSubmitted}
      isHeader
    />

    <InputField
      icon={MapPin}
      value={address}
      onChange={setAddress ? (e) => setAddress(e.target.value) : undefined}
      label="Address"
      placeholder="Address"
      error={errors.address}
      isSubmitted={isSubmitted}
    />
    <InputField
      icon={Phone}
      value={phone}
      onChange={setPhone ? (e) => setPhone(e.target.value) : undefined}
      label="Phone"
      placeholder="Phone"
      error={errors.phone}
      isSubmitted={isSubmitted}
    />

    {/* Start & End Time in one row */}
    <div className="flex gap-4">
      <div className="w-1/2">
        <InputField
          icon={Clock}
          value={startTime}
          onChange={setStartTime ? (e) => setStartTime(e.target.value) : undefined}
          label="Start Time"
          placeholder="Start Time"
          error={errors.startTime}
          isSubmitted={isSubmitted}
        />
      </div>
      <div className="w-1/2">
        <InputField
          icon={Clock}
          value={endTime}
          onChange={setEndTime ? (e) => setEndTime(e.target.value) : undefined}
          label="End Time"
          placeholder="End Time"
          error={errors.endTime}
          isSubmitted={isSubmitted}
        />
      </div>
    </div>

    <TextAreaField
      value={description}
      onChange={setDescription ? (e) => setDescription(e.target.value) : undefined}
      error={errors.description}
      isSubmitted={isSubmitted}
    />
  </div>
);

export default InputSection;

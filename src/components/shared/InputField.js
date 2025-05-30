import React from "react";

// COMPONENT:=> GENERAL INPUT FIELD WITH LABEL
export default function InputField({ label, type = "text", placeholder, noLabel = false, value, onChange, error }) {
  return (
    <div className="flex flex-col">

      {/* LABEL */}
      {!noLabel && <label className="text-gray-700 font-medium mb-1">{label}</label>}
{/*  */}
      {/* INPUT */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-400"
        }`}
      />

      {/* ERROR MESSAGE */}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

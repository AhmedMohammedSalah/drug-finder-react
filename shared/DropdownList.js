import React from "react";

/**
 * COMPONENT: DROP DOWN LIST
 * --------------------------------------
 * @param label : the label above the input
 * @param options: array of objects like { id, name }
 * @param value: the selected id (default value)
 * @param onChange: handler function for selection
 * @param error: error message string
 * @param className: optional custom CSS classes
 * Author: [SENU 🇪🇬]
 */

export default function DropdownList({
    label,
    options,
    value,
    onChange,
    error,
    className = "",
}) {
    return (
    <div className={className}>

        {/* LABEL */}
        <label className="block text-gray-700 font-medium mb-2">{label}</label>

        {/* DROP DOWN LIST */}
        <select className={`w-full p-2 border rounded ${error ? "border-red-500" : "border-gray-300"}`}
        value={value}
        onChange={onChange}
        >

        {/* PLACEHOLDER OPTION */}
        <option value="">Select {label}</option>

        {/* value: id , appreance: name */}
        {options.map((opt) => (
            <option key={opt.id} value={opt.id}> {opt.name}</option>
        ))}
        </select>

        {/* ERROR MESSAGE */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

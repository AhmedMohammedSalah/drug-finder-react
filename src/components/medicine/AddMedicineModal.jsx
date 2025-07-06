import React, { useEffect, useState } from "react";
import apiEndpoints from "../../services/api";
import { X } from "lucide-react";

const AddMedicineModal = ({ onClose, onSuccess, storeId, initialData }) => {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    brand_name: "",
    generic_name: "",
    chemical_name: "",
    atc_code: "",
    cas_number: "",
    description: "",
    stock: 1, // Changed default from 0 to 1
    price: 0.0,
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ⏎ Fill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        brand_name: initialData.brand_name || "",
        generic_name: initialData.generic_name || "",
        chemical_name: initialData.chemical_name || "",
        atc_code: initialData.atc_code || "",
        cas_number: initialData.cas_number || "",
        description: initialData.description || "",
        stock: initialData.stock || 1, // Changed default from 0 to 1
        price: initialData.price || 0.0,
        image: null, // Don't prefill image
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.stock <= 0) {
      newErrors.stock = "Quantity must be greater than 0";
    }

    if (formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    if (!formData.brand_name.trim()) {
      newErrors.brand_name = "Brand name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        form.append(key, formData[key]);
      }
    }

    if (!isEditMode && storeId) {
      form.append("store", storeId);
    }

    setSubmitting(true);
    try {
      let res;
      if (isEditMode) {
        res = await apiEndpoints.inventory.updateMedicine(initialData.id, form);
      } else {
        res = await apiEndpoints.inventory.createMedicine(form);
      }
      onSuccess(res.data);
    } catch (err) {
      console.error(`${isEditMode ? "Update" : "Create"} failed:`, err);
      alert("Something went wrong while saving the medicine.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isEditMode ? "Update Medicine" : "Add New Medicine"}
        </h2>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            Medicine Image {isEditMode && "(leave empty to keep current)"}
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["brand_name", "Brand Name *", "text", true],
            ["generic_name", "Generic Name", "text", false],
            ["chemical_name", "Chemical Name", "text", false],
            ["atc_code", "ATC Code", "text", false],
            ["cas_number", "CAS Number", "text", false],
            ["stock", "Stock *", "number", true, { min: 1 }],
            [
              "price",
              "Price (EGP) *",
              "number",
              true,
              { min: 0, step: "0.01" },
            ],
          ].map(
            ([
              name,
              label,
              type = "text",
              required = false,
              inputProps = {},
            ]) => (
              <div key={name} className="mb-2">
                <label className="block text-gray-600 mb-1">
                  {label}
                  {required && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`border ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  } rounded w-full px-3 py-2`}
                  required={required}
                  {...inputProps}
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                )}
              </div>
            )
          )}
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="border border-gray-300 rounded w-full px-3 py-2"
          />
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {submitting
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
              ? "Update Medicine"
              : "Add Medicine"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicineModal;

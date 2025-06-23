import React, { useEffect, useState } from 'react';
import apiEndpoints from '../services/api'; // Assuming this handles API calls
import { toast } from 'react-toastify'; // For notifications
import Header from '../components/home/header'; // Global header
import Sidebar from '../components/shared/sidebar';
// import Nav from '../components/pharmacist/dashboardNav'; // Dashboard navigation - uncomment if needed

// Placeholder for a default profile image if none is provided
const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/150/cccccc/ffffff?text=No+Image';

export default function ClientProfilePage() {
    const [form, setForm] = useState({
        // User Model fields (read-only on this page)
        name: '',
        email: '',
        email_verified: false,


        // Client Model fields (some editable, some read-only)
        info_disease: '',
        image_profile: null, // File object for upload
        image_preview: null, // URL for displaying the image
        last_latitude: null,
        last_longitude: null,
        default_latitude: null,
        default_longitude: null,
        is_verified_purchase: false,
    });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // State to hold the initial data for reverting changes
    const [initialForm, setInitialForm] = useState({});

    // Fetch profile data on component mount
    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            setError(null);
            try {
                // The API response will now contain all fields from ClientSerializer
                const res = await apiEndpoints.client.getClientProfile();
                const profileData = res.data;

                const loadedForm = {
                    name: profileData.name || '',
                    email: profileData.email || '',
                    email_verified: profileData.email_verified === true || profileData.email_verified === "true",// Populate from API
                    is_active: profileData.is_active || false,           // Populate from API
                    role: profileData.role || '',                        // Populate from API

                    info_disease: profileData.info_disease || '',
                    image_profile: null, // No file initially loaded
                    image_preview: profileData.image_profile || DEFAULT_PROFILE_IMAGE,
                    last_latitude: profileData.last_latitude,
                    last_longitude: profileData.last_longitude,
                    default_latitude: profileData.default_latitude,
                    default_longitude: profileData.default_longitude,
                    is_verified_purchase: profileData.is_verified_purchase || false, // Populate from API
                };
                setForm(loadedForm);
                setInitialForm(loadedForm); // Set initial form state for potential cancellation
            } catch (err) {
                console.error("Error fetching client profile:", err);
                toast.error("Failed to load client profile. Please try again.");
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    // Handle input changes (text and file)
    const handleChange = e => {
        const { name, value, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            setForm(prev => ({
                ...prev,
                image_profile: file,
                image_preview: URL.createObjectURL(file), // Create a URL for immediate preview
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submission for profile update
    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const formData = new FormData();
        // Only append info_disease if it has changed from its initial value
        if (form.info_disease !== initialForm.info_disease) {
            formData.append('info_disease', form.info_disease);
        }
        // Only append image_profile if a new file has been selected
        if (form.image_profile) {
            formData.append('image_profile', form.image_profile);
        }

        try {
            await apiEndpoints.client.updateClientProfile(formData);
            toast.success("Client profile updated successfully!");
            setEditMode(false); // Exit edit mode on success
            setForm(prev => ({ ...prev, image_profile: null })); // Clear file input state after successful upload
            // Optionally, re-fetch profile data to ensure local state is perfectly synced with server
            // await fetchProfile(); // Uncomment if you want to re-fetch all data after saving
        } catch (err) {
            console.error("Error updating client profile:", err);
            toast.error("Profile update failed. Please try again.");
            setError("Failed to update profile.");
        } finally {
            setSubmitting(false);
        }
    };

    // Revert form state to initial values when canceling edit mode
    const handleCancelEdit = () => {
        setEditMode(false);
        setForm(initialForm); // Revert to initial fetched data
    };

    // Helper function to display boolean values
    const renderBooleanStatus = (value) => {
        return value ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Not Verified
            </span>
        );
    };

    const renderLocation = (lat, lon) => {
        if (lat !== null && lon !== null && lat !== undefined && lon !== undefined) {
            return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        }
        return 'Not set';
    };


    return (
        <>
          <Sidebar />

            <div className="container mx-auto px-4 py-8">
                {/* <Nav /> */}

                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8 mt-5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-3xl font-extrabold text-gray-800">welcome Back {form.name}</h3>
                        {!editMode && (
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading client profile...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600 font-medium">
                            <p>{error}</p>
                            <p>Please refresh the page or try again later.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Image Section */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-28 h-28">
                                    <div className="rounded-full overflow-hidden border-4 border-blue-200 shadow-md w-full h-full">
                                        <img
                                            src={form.image_preview || DEFAULT_PROFILE_IMAGE}
                                            alt="Profile Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = DEFAULT_PROFILE_IMAGE; }}
                                        />
                                    </div>

                                    {form.email_verified && (
                                        <span className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md">
                                            Verified
                                        </span>
                                    )}
                                </div>

                                {editMode && (
                                    <label
                                        htmlFor="image_profile"
                                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md border border-gray-300 transition duration-300 ease-in-out"
                                    >
                                        Choose New Photo
                                        <input
                                            id="image_profile"
                                            type="file"
                                            name="image_profile"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>


                            {/* Name Input - Always Read-Only (from User model) */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    id="name"
                                    value={form.name}
                                    readOnly
                                    className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            {/* Email Input - Always Read-Only (from User model) */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    id="email"
                                    value={form.email}
                                    readOnly
                                    className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            {/* Email Verified Status (from User model) */}
                            {form.email_verified && (
                                <span className="absolute bottom-0 right-0 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md">
                                    Verified
                                </span>
                            )}



                            {/* Health Info Textarea - Editable in Edit Mode (from Client model) */}
                            <div>
                                <label htmlFor="info_disease" className="block text-sm font-medium text-gray-700 mb-1">Health Information</label>
                                <textarea
                                    id="info_disease"
                                    name="info_disease"
                                    value={form.info_disease}
                                    onChange={handleChange}
                                    readOnly={!editMode}
                                    rows="4"
                                    placeholder={editMode ? "Enter any relevant health information..." : "No health information provided."}
                                    className={`w-full border border-gray-300 px-4 py-2 rounded-md transition duration-300 ease-in-out
                                        ${!editMode ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : 'bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                    `}
                                />
                            </div>

                            {/* Last Known Location (from Client model) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Known Location</label>
                                <input
                                    value={renderLocation(form.last_latitude, form.last_longitude)}
                                    readOnly
                                    className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            {/* Default Location (from Client model) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Delivery Location</label>
                                <input
                                    value={renderLocation(form.default_latitude, form.default_longitude)}
                                    readOnly
                                    className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            {/* Verified Purchase Status (from Client model) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Verification</label>
                                {renderBooleanStatus(form.is_verified_purchase)}
                            </div>

                            {/* Action Buttons in Edit Mode */}
                            {editMode && (
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 transition duration-300 ease-in-out"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
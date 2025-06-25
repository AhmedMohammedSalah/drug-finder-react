// 🧠 Inside hooks/useStoreForm.js
import { useState, useEffect } from 'react';
import apiEndpoints from '../services/api';

const useStoreForm = () => {

    // STATES FOR THE FORM:

    // logo, name, addr, phone, desc, lat,lng, owner
    const [logoImage, setLogoImage] = useState(null);
    const [storeName, setStoreName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [latLng, setLatLng] = useState({ lat: 30.0444, lng: 31.2357 });
    const [ownerId, setOwnerId] = useState(null);

    // flag: showMapModal, isSubmitting, isSubmitted, loading, 
    const [showMapModal, setShowMapModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [mapLoading, setMapLoading] = useState(false);

    // 🧨 Field-level errors
    const [errors, setErrors] = useState({});

    useEffect(() => {

        // get owner id
        apiEndpoints.users.getPharmacistProfile().then((res) => {
        setOwnerId(res.data.id);
        });

        // get longtude, latitude
        if (navigator.geolocation) {
            setMapLoading(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setMapLoading(false);
                    },
                    (err) => {
                    console.warn("Geolocation error:", err);
                    setMapLoading(false);
                    },
                    { enableHighAccuracy: true, timeout: 5000 }
            );
        }
    }, []);

    // submission
    const handleSubmit = async () => {

        // validations
        const validationErrors = {};
        if (!storeName.trim()) validationErrors.storeName = 'Store name is required.';
        if (!address.trim()) validationErrors.address = 'Address is required.';
        if (!phone.trim()) validationErrors.phone = 'Phone number is required.';
        setErrors(validationErrors);


        // DEBUG:
        console.log("the validation error: ", validationErrors)
        console.log("what inside the errors = ", errors)

        if (Object.keys(validationErrors).length > 0) return;

        // payload
        const payload = {
        owner: ownerId,
        store_name: storeName,
        store_type: 'pharmacy',
        store_address: address,
        phone: phone,
        description,
        latitude: latLng.lat,
        longitude: latLng.lng,
        };

    try {
      setIsSubmitting(true);
      await apiEndpoints.pharmacies.createStore(payload);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    logoImage, setLogoImage,
    storeName, setStoreName,
    address, setAddress,
    phone, setPhone,
    description, setDescription,
    latLng, setLatLng,
    showMapModal, setShowMapModal,
    isSubmitting, isSubmitted,
    mapLoading,
    handleLatChange: (e) => setLatLng((prev) => ({ ...prev, lat: parseFloat(e.target.value) })),
    handleLngChange: (e) => setLatLng((prev) => ({ ...prev, lng: parseFloat(e.target.value) })),
    handleSubmit,
    errors,
  };
};

export default useStoreForm;

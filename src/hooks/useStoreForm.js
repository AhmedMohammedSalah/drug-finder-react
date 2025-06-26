import { useState, useEffect } from 'react';
import apiEndpoints from '../services/api';

const useStoreForm = () => {
  const [logoImage, setLogoImage] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [latLng, setLatLng] = useState({ lat: 30.0444, lng: 31.2357 });
  const [ownerId, setOwnerId] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // for approva logic
  const [licenseStatus, setLicenseStatus] = useState(null);


  const [showMapModal, setShowMapModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasStore, setHasStore] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await apiEndpoints.users.getPharmacistProfile();
        const pharmacist = res.data;
  
        console.log("Pharmacist data:", pharmacist);
  
        setOwnerId(pharmacist.id);
  
        if (pharmacist.has_store && pharmacist.medical_stores_data) {
          setHasStore(true);
          const store = pharmacist.medical_stores_data;
  
          setStoreId(store.id);
          setStoreName(store.store_name);
          setAddress(store.store_address);
          setPhone(store.phone);
          setDescription(store.description);
          setLatLng({ lat: store.latitude, lng: store.longitude });
          setStartTime(store.start_time || '');
          setEndTime(store.end_time || '');

          // for approvla logic
          setLicenseStatus(pharmacist.license_status);

  
          if (store.store_logo) {
            const fullLogoUrl = store.store_logo.startsWith("http")
              ? store.store_logo
              : `http://localhost:8000${store.store_logo}`;
            setLogoImage(fullLogoUrl);
          }
  
          setIsSubmitted(true);
        } else {
          // ✅ Geolocation fallback only if pharmacist has no store
          setHasStore(false);
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
        }
      } catch (err) {
        console.error("Error loading pharmacist or store:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    init();
  }, []);
  
  

  const handleSubmit = async () => {
    const validationErrors = {};
    if (!storeName.trim()) validationErrors.storeName = 'Store name is required.';
    if (!address.trim()) validationErrors.address = 'Address is required.';
    if (!phone.trim()) validationErrors.phone = 'Phone number is required.';
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const formData = new FormData();
    formData.append('owner', ownerId);
    formData.append('store_name', storeName);
    formData.append('store_type', 'pharmacy');
    formData.append('store_address', address);
    formData.append('phone', phone);
    formData.append('description', description);
    formData.append('latitude', latLng.lat);
    formData.append('longitude', latLng.lng);

    // ✅ Always include start/end time

    console.log("startTime:", startTime);
    console.log("endTime:", endTime);

    formData.append('start_time', startTime?.toString() || '');  
    formData.append('end_time', endTime?.toString() || '');
    

    if (logoImage && typeof logoImage !== 'string') {
      formData.append('store_logo', logoImage);
    }

    try {
      setIsSubmitting(true);

      if (hasStore && storeId) {
        await apiEndpoints.pharmacies.updateStore(storeId, formData);
      } else {
        await apiEndpoints.pharmacies.createStore(formData);
        await apiEndpoints.users.updatePharmacist(ownerId, { has_store: true });
        setHasStore(true);
      }

      setIsSubmitted(true);
      setIsEditMode(false);
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
    startTime, setStartTime,
    endTime, setEndTime,
    showMapModal, setShowMapModal,
    isSubmitting, isSubmitted,
    mapLoading,
    handleLatChange: (e) => setLatLng((prev) => ({ ...prev, lat: parseFloat(e.target.value) })),
    handleLngChange: (e) => setLatLng((prev) => ({ ...prev, lng: parseFloat(e.target.value) })),
    handleSubmit,
    errors,
    isEditMode,
    setIsEditMode,
    hasStore,
    isLoading, 
    licenseStatus, // for approval logic
  };
};

export default useStoreForm;

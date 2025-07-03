import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiEndpoints from '../services/api';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/client/checkout/CheckoutForm';
import CheckoutMap from '../components/client/checkout/CheckoutMap';
import OrderSummary from '../components/client/checkout/OrderSummary';
import ErrorPopup from '../components/client/checkout/ErrorPopup';
import {  clearCart,
} from '../features/cartSlice';
import { useDispatch } from 'react-redux';

const stripePublicKey = 'pk_test_51OiLR4EI022bdeAWbHKBYqgPrQBKTXEFEUr7fbrvFRic2OsAFEUSs1tgsJG6aaSoL88nyCOpfL7xQgjwLcowPCPF00fVMpPj3W';
const stripePromise = loadStripe(stripePublicKey);

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showMap, setShowMap] = useState(false);
  const dispatch = useDispatch();
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null
  });

  const accessToken = localStorage.getItem('access_token');

  const [formData, setFormData] = useState({
    shipping_location: '',
    paymentMethod: 'card',
  });

  const [orderData, setOrderData] = useState({
    store: null,
    client: null,
    items: [],
    shipping_location: '',
    order_status: 'pending',
    payment_method: 'card',
    shipping_cost: '0.00',
    tax: '0.00',
    total_price: '0.00',
    subtotal: '0.00'
  });

  const handleLocationSelect = (lat, lng) => {
    setLocation({ latitude: lat, longitude: lng });
    setShowMap(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not get your location. Please enter it manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const showErrorPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const closeErrorPopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };




  const [clientProfile, setClientProfile] = useState(null);

useEffect(() => {
  const fetchClientProfile = async () => {
    try {
      const res = await apiEndpoints.client.getClientProfile();
      setClientProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch client profile:", err);
    }
  };

  fetchClientProfile();
}, []);


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await apiEndpoints.cart.getCart();
        if (response.data?.results?.length > 0) {
          const cartData = response.data.results[0];
          setCart(cartData);
          
          const subtotal = cartData.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
          }, 0);
          
          setOrderData(prev => ({
            ...prev,
            store: cartData.store,
            client: cartData.user || null,
            items: cartData.items.map(item => ({
              item_id: item.product,
              ordered_quantity: item.quantity,
              price: item.price
            })),
            shipping_cost: cartData.shipping_cost?.toString() || '0.00',
            tax: cartData.tax?.toString() || '0.00',
            total_price: cartData.total_price?.toString() || '0.00',
            subtotal: subtotal.toFixed(2)
          }));
        } else {
          setCart(null);
        }
      } catch (err) {
        console.error(err);
        const errorMessage = 'Failed to load cart data.';
        setError(errorMessage);
        showErrorPopup(errorMessage);
      }
    };
    if (accessToken) fetchCart();
  }, [accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'paymentMethod') setOrderData(prev => ({ ...prev, payment_method: value }));
  };

  const handleOrderSubmit = async (orderPayload) => {
  setLoading(true);
  setError(null);

  try {
    if (
      location.latitude &&
      location.longitude &&
      clientProfile &&
      (
        parseFloat(location.latitude).toFixed(4) !== parseFloat(clientProfile.default_latitude).toFixed(4) ||
        parseFloat(location.longitude).toFixed(4) !== parseFloat(clientProfile.default_longitude).toFixed(4)
      )
    ) {
      const updatedLocation = new FormData();
      updatedLocation.append('default_latitude', location.latitude);
      updatedLocation.append('default_longitude', location.longitude);
      await apiEndpoints.client.updateClientProfile(updatedLocation);
      console.log(' Updated client default location before order.');
    }

    const response = await apiEndpoints.orders.createOrder(orderPayload);

    if (response.data) {
      try {
        dispatch(clearCart(cart.id));
      } catch (err) {
        console.error("Error clearing cart:", err);
      }

      if (orderPayload.payment_method === 'cash') {
        navigate('/order-success', { state: { orderId: response.data.order.id } });
      }
      return response.data;
    }
  } catch (err) {
    console.error(err);
    const errorMessage = err.response?.data?.message || 'Failed to place order';
    setError(errorMessage);
    showErrorPopup(errorMessage);
  } finally {
    setLoading(false);
  }
};


  if (!cart) return <div className="flex justify-center items-center h-64">Loading cart data...</div>;

  return (
    <Elements stripe={stripePromise}>
      <section className="bg-gray-50 py-8 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h1>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full w-2/3"></div>
            </div>
            <ol className="flex items-center mt-4 text-sm font-medium text-gray-500">
              <li className="flex items-center text-blue-600">
                <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full">1</span>
                Cart
              </li>
              <li className="flex items-center ml-4 text-blue-600">
                <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full">2</span>
                Checkout
              </li>
              <li className="flex items-center ml-4">
                <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full">3</span>
                Order Summary
              </li>
            </ol>
          </div>

          <div className="mt-6 sm:mt-8 lg:flex lg:gap-8 xl:gap-12">
            <div className="flex-1 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="shipping_location" className="block mb-2 text-sm font-medium text-gray-900">
                      Shipping Address
                    </label>
                    <input
                      id="shipping_location"
                      name="shipping_location"
                      type="text"
                      value={formData.shipping_location}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Delivery Location
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Select on Map
                      </button>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Use Current Location
                      </button>
                    </div>
                    {location.latitude && (
                      <p className="mt-2 text-sm text-gray-500">
                        Location set: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
                
                {showMap && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    <CheckoutMap 
                      initialLocation={location.latitude ? { 
                        lat: location.latitude, 
                        lng: location.longitude 
                      } : null}
                      onLocationSelect={handleLocationSelect}
                      onClose={() => setShowMap(false)}
                    />
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center pl-4 border border-gray-200 rounded">
                    <input
                      id="card-payment"
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label htmlFor="card-payment" className="w-full py-4 ml-2 text-sm font-medium text-gray-900">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="flex items-center pl-4 border border-gray-200 rounded">
                    <input
                      id="cash-payment"
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                    />
                    <label htmlFor="cash-payment" className="w-full py-4 ml-2 text-sm font-medium text-gray-900">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 w-full lg:max-w-md space-y-6">
              <OrderSummary totalPrice={orderData.total_price} />
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CheckoutForm
                  formData={formData}
                  handleChange={handleChange}
                  loading={loading}
                  error={error}
                  orderData={orderData}
                  onOrderSubmit={handleOrderSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {showPopup && (
        <ErrorPopup message={popupMessage} onClose={closeErrorPopup} />
      )}
    </Elements>
  );
};

export default Checkout;
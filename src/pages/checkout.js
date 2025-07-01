import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiEndpoints from '../services/api';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// [OKS]  stripe public key should be set in your environment variables
const stripePublicKey = 'pk_test_51OiLR4EI022bdeAWbHKBYqgPrQBKTXEFEUr7fbrvFRic2OsAFEUSs1tgsJG6aaSoL88nyCOpfL7xQgjwLcowPCPF00fVMpPj3W'
const stripePromise = loadStripe(stripePublicKey);

const CheckoutForm = ({ 
  formData, 
  handleChange, 
  loading, 
  error,
  orderData,
  onOrderSubmit
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError(null);

    try {
      const orderPayload = {
        ...orderData,
        shipping_location: formData.shipping_location,
      };

      const orderResponse = await onOrderSubmit(orderPayload);

      if (formData.paymentMethod === 'card') {
        if (!stripe || !elements) {
          throw new Error('Stripe has not been initialized');
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          orderResponse.client_secret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
            }
          }
        );

        if (stripeError) {
          throw stripeError;
        }

        if (paymentIntent.status === 'succeeded') {
          // [OKS]  Update order status to paid
          await apiEndpoints.orders.updateOrderStatus(orderResponse.order.id, { status: 'paid' });
            // [OKS] Navigate to success page
            navigate('/order-success', { state: { orderId: orderResponse.order.id } });
        }
      }
      
      return orderResponse;
    } catch (err) {
      setLocalError(err.message);
      throw err;
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="shipping_location" className="block mb-2 text-sm font-medium text-gray-900 ">
          Shipping Location
        </label>
        <input
          id="shipping_location"
          name="shipping_location"
          type="text"
          value={formData.shipping_location}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          required
        />
      </div>

      {formData.paymentMethod === 'card' && (
        <div className="border border-gray-200  p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-3">Card Details</h4>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      )}

      {(error || localError) && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg " role="alert">
          {error || localError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || localLoading || (formData.paymentMethod === 'card' && !stripe)}
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
      >
        {(loading || localLoading) ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : formData.paymentMethod === 'card' ? 'Pay Now' : 'Place Order'}
      </button>
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(null);

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
    shipping_cost: '20.00',
    tax: '5.00',
    total_price: '0.00',
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await apiEndpoints.cart.getCart();

        if (response.data?.results?.length > 0) {
          const cartData = response.data.results[0];
          setCart(cartData);

          const storeId = cartData.store;
          console.log('Store ID:', storeId);
           
          setOrderData(prev => ({
            ...prev,
            store: storeId,
            client: cartData.user || null,
            items: cartData.items.map(item => ({
              item_id: item.product,
              ordered_quantity: item.quantity
            })),
            shipping_cost: cartData.shipping_cost.toString(),
            tax: cartData.tax.toString(),
            total_price: cartData.total_price.toString(),
          }));
        } else {
          setCart(null);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load cart data.');
      }
    };

    if (accessToken) {
      fetchCart();
    }
  }, [accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'paymentMethod') {
      setOrderData(prev => ({ ...prev, payment_method: value }));
    }
  };

  const handleOrderSubmit = async (orderPayload) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiEndpoints.orders.createOrder(orderPayload);
      
      if (response.data) {
        //  [OKS]Navigate to success page for cash payments
        if (orderPayload.payment_method === 'cash') {
          navigate('/order-success', { state: { orderId: response.data.order.id } });
        }
        return response.data;
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order');
      throw err;
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
            <div className="w-full bg-gray-200 rounded-full h-2.5 ">
              <div className="bg-blue-600 h-2.5 rounded-full w-2/3"></div>
            </div>
            <ol className="flex items-center mt-4 text-sm font-medium text-gray-500 ">
              <li className="flex items-center text-blue-600 ">
                <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full shrink-0 ">1</span>
                Cart
              </li>
              <li className="flex items-center ml-4 text-blue-600 ">
                <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full shrink-0 ">2</span>
                Checkout
              </li>
              <li className="flex items-center ml-4">
                <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full shrink-0">3</span>
                Order Summary
              </li>
            </ol>
          </div>

          <div className="mt-6 sm:mt-8 lg:flex lg:gap-8 xl:gap-12">
            <div className="flex-1 space-y-6">
              <div className="bg-white  p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-900  mb-4">Shipping Information</h2>
                <CheckoutForm 
                  formData={formData} 
                  handleChange={handleChange} 
                  loading={loading} 
                  error={error}
                  orderData={orderData}
                  onOrderSubmit={handleOrderSubmit}
                />
              </div>

              <div className="bg-white  p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900  mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center pl-4 border border-gray-200 rounded ">
                    <input 
                      id="card-payment" 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={formData.paymentMethod === 'card'} 
                      onChange={handleChange} 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 " 
                    />
                    <label htmlFor="card-payment" className="w-full py-4 ml-2 text-sm font-medium text-gray-900 ">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="flex items-center pl-4 border border-gray-200 rounded ">
                    <input 
                      id="cash-payment" 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash" 
                      checked={formData.paymentMethod === 'cash'} 
                      onChange={handleChange} 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 " 
                    />
                    <label htmlFor="cash-payment" className="w-full py-4 ml-2 text-sm font-medium text-gray-900 ">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 w-full lg:max-w-md space-y-6">
              <div className="bg-white  p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900  mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 ">Subtotal</span>
                    <span className="font-medium">${(parseFloat(orderData.total_price) - parseFloat(orderData.shipping_cost) - parseFloat(orderData.tax)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 ">Shipping</span>
                    <span className="font-medium">${orderData.shipping_cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 ">Tax</span>
                    <span className="font-medium">${orderData.tax}</span>
                  </div>
                  <div className="border-t border-gray-200  pt-3 flex justify-between">
                    <span className="font-bold text-gray-900 ">Total</span>
                    <span className="font-bold text-blue-600 ">${orderData.total_price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Elements>
  );
};

export default Checkout;
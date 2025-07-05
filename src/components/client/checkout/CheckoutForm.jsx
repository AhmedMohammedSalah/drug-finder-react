import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import apiEndpoints from '../../../services/api';

const CheckoutForm = ({ formData, handleChange, loading, error, orderData, onOrderSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
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
          throw new Error('Payment system not ready. Please try again.');
        }

        try {
          const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
            orderResponse.client_secret,
            {
              payment_method: {
                card: elements.getElement(CardElement),
              },
            }
          );

          if (stripeError) {
            throw new Error(stripeError.message || 'Payment failed. Please check your card details.');
          }

          if (paymentIntent.status === 'succeeded') {
            await apiEndpoints.orders.updateOrderStatus(orderResponse.order.id, { status: 'paid' });
            navigate('/order-success', { 
              state: { orderId: orderResponse.order.id },
              replace: true
            });
          }
        } catch (stripeErr) {
          console.error('Stripe Error:', stripeErr);
          throw new Error('Payment processing failed. Please try again or use a different payment method.');
        }
      }

      return orderResponse;
    } catch (err) {
      const errorMessage = typeof err.message === 'string' 
        ? err.message
        : 'An unexpected error occurred during checkout.';
      
      const safeErrorMessage = errorMessage.replace(/client_secret=[^\s]+/, '[redacted]');
      
      setLocalError(safeErrorMessage);
      console.error('Checkout Error:', err); 
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formData.paymentMethod === 'card' && (
        <div className="border border-gray-200 p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-3">Card Details</h4>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
              hidePostalCode: true
            }}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      )}

      {(error || localError) && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error || localError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || localLoading || (formData.paymentMethod === 'card' && !stripe)}
        className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-blue-400 transition-colors"
      >
        {loading || localLoading ? (
          <span className="flex items-center justify-center">
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
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

export default CheckoutForm;
import React from "react";
import ClientDetails from './clientDetails';
import StoreDetails from './storeDetails';
import StaticMap from './staticMap'; 


// [SARA] : Shared ReceiptOrder component for admin pages
const ReceiptOrder = ({ order, fetchClientById }) => {
  const isOpen = true; // Always open when used as a component in details
  // [OKS] Parse lat/lng from `order.client.shipping_location
 let mapLocation = null;
  if (order.client?.default_latitude && order.client?.default_longitude) {
    mapLocation = {
      lat: order.client.default_latitude,
      lng: order.client.default_longitude,
      label: "Delivery Location" 
    };
  }


  return (
    <div
      className="mt-6 border-t pt-6 bg-gray-50 rounded-xl overflow-hidden transition-all duration-500 ease-in-out shadow-lg border border-blue-200 max-w-2xl mx-auto px-6 pb-6"
      style={{
        maxHeight: isOpen ? 1000 : 0,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'scaleY(1)' : 'scaleY(0.98)',
        transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)'
      }}>
      {/* Receipt Header */}
      <div className="flex items-center gap-4 mb-6 border-b pb-3 border-blue-100">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
        <span className="text-2xl font-extrabold text-blue-700 tracking-wide">Order Receipt</span>
        <span className="ml-auto text-xs text-gray-400">{order.timestamp}</span>
      </div>
      {/* Receipt Body: 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 mb-6">
        <div><span className="font-semibold text-gray-700">Order ID:</span> <span className="text-gray-900">{order.id}</span></div>
        <div>
          <span className="font-semibold text-gray-700">Client:</span>
          <ClientDetails client={order.client} fetchClientById={fetchClientById} />
        </div>
        <div><span className="font-semibold text-gray-700">Store:</span>
          <StoreDetails store={order.store} />
        </div>
        <div><span className="font-semibold text-gray-700">Status:</span> <span className="text-gray-900">{order.order_status}</span></div>
        <div><span className="font-semibold text-gray-700">Payment:</span> <span className="text-gray-900">{order.payment_method}</span></div>
        <div><span className="font-semibold text-gray-700">Shipping Location:</span> <span className="text-gray-900">{order.shipping_location}</span></div>
        <div><span className="font-semibold text-gray-700">Shipping Cost:</span> <span className="text-gray-900">{order.shipping_cost} EGP</span></div>
        <div><span className="font-semibold text-gray-700">Tax:</span> <span className="text-gray-900">{order.tax} EGP</span></div>
      </div>
      {/* Order Items Table */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
          <span className="font-bold text-blue-700 text-base tracking-wide">Order Items</span>
        </div>
        {order.items_details && Array.isArray(order.items_details) && order.items_details.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-blue-100 bg-white mt-2">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-blue-50 text-blue-800">
                  <th className="px-3 py-2 text-left font-semibold">Name</th>
                  <th className="px-3 py-2 text-left font-semibold">Quantity</th>
                  <th className="px-3 py-2 text-left font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items_details.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/60'}>
                    <td className="px-3 py-2 font-medium text-gray-800">{item.name}</td>
                    <td className="px-3 py-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">x{item.quantity}</span>
                    </td>
                    <td className="px-3 py-2 text-gray-700 font-semibold">{item.price} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto mt-1 text-gray-800">{JSON.stringify(order.items, null, 2)}</pre>
        )}
      </div>
      {/* Receipt Summary */}
      <div className="flex flex-col items-end border-t pt-5 border-blue-100">
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <div className="flex justify-between text-gray-700 text-sm">
            <span>Shipping Cost:</span>
            <span>{order.shipping_cost} EGP</span>
          </div>
          <div className="flex justify-between text-gray-700 text-sm">
            <span>Tax:</span>
            <span>{order.tax} EGP</span>
          </div>
          <div className="flex justify-between text-blue-700 font-bold text-base border-t border-blue-200 mt-3 pt-3">
            <span>Total:</span>
            <span>{order.total_price} EGP</span>
          </div>
        </div>
      </div>

     {/* [OKS] Map Section - Only shown if we have location data */}
     {mapLocation && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold text-blue-700 mb-2">Delivery Location</h3>
    <div className="h-64 md:h-96 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
      <StaticMap
        initialLocation={mapLocation}
        markers={[{
          position: mapLocation,
          label: mapLocation.label
        }]}
        zoom={14}
        style={{ height: "100%", width: "100%" }} 
      />
    </div>
    <p className="text-sm text-gray-500 mt-2 text-center">
      Red marker indicates delivery location
    </p>
  </div>
)}
    </div>
  );
};

export default ReceiptOrder;

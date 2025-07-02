const OrderSummary = ({ totalPrice }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Order Total</h3>
      <div className="space-y-3">
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-blue-600">${totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
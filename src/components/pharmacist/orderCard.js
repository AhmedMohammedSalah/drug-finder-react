function orderCard(order) {
  return(
    <div class="order-card">
      <h3>Order ID: ${order.id}</h3>
      <p>Patient: ${order.patientName}</p>
      <p>Medication: ${order.medicationName}</p>
      <p>Quantity: ${order.quantity}</p>
      <p>Status: ${order.status}</p>
    </div>
  );
}
export default orderCard;
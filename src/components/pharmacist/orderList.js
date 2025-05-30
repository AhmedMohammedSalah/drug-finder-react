// import React, { useState } from 'react';
import orderCard from './orderCard';

function orderList() {
  return (
    <div>
      <h1>Order List</h1>
      <p>This is the order list for pharmacists.</p>
      <orderCard
        id="1"
        patientName="John Doe"
        medicationName="Aspirin"
        quantity="30"
        status="Pending"
      />
      {/* Additional content can be added here */}
    </div>
  );
}
export default orderList;
// src/components/OrderList.tsx
import React from 'react';
import OrderCard from './orderCard';
import IconButton from '../shared/btn';

export default function OrderList() {
  return (
    <div className="min-h-screen rounded-[20px] bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order List</h1>
        <p className="text-lg text-gray-600 mb-6">
          This is the order list for pharmacists.
        </p>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <OrderCard
            id="1"
            patientName="John Doe"
            medicationName="Aspirin"
            quantity="30"
            status="Pending"
          />
          <OrderCard
            id="2"
            patientName="John Doe"
            medicationName="Aspirin"
            quantity="30"
            status="Pending"
          />
          <OrderCard
            id="3"
            patientName="John Doe"
            medicationName="Aspirin"
            quantity="30"
            status="Pending"
          />
          <OrderCard
            id="4"
            patientName="John Doe"
            medicationName="Aspirin"
            quantity="30"
            status="Pending"
          />
          {/* Add more OrderCard components here for additional orders */}
        </div>
        {/* <div className="mt-6 flex justify-end">
          <IconButton
            btnColor="blue"
            btnShade="500"
            textColor="white"
            hoverShade="600"
            focusShade="400"
            path="/add-order"
            icon="plus"
            name="Add Order"
          />
        </div> */}
      </div>
    </div>
  );
}
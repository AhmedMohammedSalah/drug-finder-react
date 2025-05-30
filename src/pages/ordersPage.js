// import orderList from "../components/pharmacist/orderList";
import OrderList from "../components/pharmacist/orderList";

function ordersPage() {
  return (
    <div>
      <h1>Orders</h1>
      {/* <p>Here you can view and manage your orders.</p> */}
      {/* <button id="load-orders">Load Orders</button> */}
      <div id="orders-list">
        <OrderList />
      </div>
    </div>
  );
}

export default ordersPage;
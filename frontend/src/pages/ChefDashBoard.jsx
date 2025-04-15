import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChefOrderCard from "../components/ChefOrderCard.jsx";

export default function ChefDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `/api/order/getChefOrders?hotelId=${currentUser.hotelId}&staffId=${currentUser.staffId}`
        );
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error fetching chef orders:", err);
      }
    };

    if (currentUser?.role === "chef") {
      fetchOrders();
    }
  }, [currentUser]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-800">
        Orders To Be Prepared
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders for you currently.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
          {orders.map((order, idx) => (
            <ChefOrderCard key={idx} order={order} hotelId={currentUser.hotelId}/>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WaiterOrderCard from "../components/WaiterOrderCard";

function WaiterDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        const res = await fetch(
          `/api/order/get-waiter-orders?hotelId=${currentUser.hotelId}&staffId=${currentUser.staffId}`
        );
        const data = await res.json();

        if (res.ok) {
          setAssignedOrders(data.orders || []);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching waiter orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.staffId && currentUser?.hotelId) {
      fetchAssignedOrders();
    }
  }, [currentUser]);

  const handleDelivered = (orderId) => {
    setAssignedOrders((prev) => prev.filter((order) => order._id !== orderId));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
        Waiter Dashboard
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading assigned orders...</p>
      ) : assignedOrders.length === 0 ? (
        <p className="text-center text-gray-500">No assigned orders currently.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {assignedOrders.map((order) => (
            <WaiterOrderCard
              key={order._id}
              order={order}
              hotelId={currentUser.hotelId}
              onDelivered={handleDelivered}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WaiterDashboard;

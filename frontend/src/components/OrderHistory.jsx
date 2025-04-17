import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function OrderHistory() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/order/orderhistory?email=${currentUser.email}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    if (currentUser?.email) {
      fetchOrders();
    }
  }, [currentUser]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showMore = () => setVisibleCount((prev) => prev + 3);
  const showLess = () => setVisibleCount(3);

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Order History</h3>

      {orders.slice(0, visibleCount).map((order, idx) => (
        <div key={idx} className="mb-4 border rounded-md p-3 shadow-sm bg-gray-50">
          <div className="flex justify-between text-sm text-gray-700">
            <span className="font-medium">{order.restaurantName}</span>
            <span>{formatDate(order.createdAt)} | {formatTime(order.createdAt)}</span>
          </div>
          <ul className="mt-2 ml-4 text-sm list-disc text-gray-600">
            {(order.items || []).map((item, i) => (
              <li key={i}>
                {item.foodName} × {item.quantity} — ₹{item.amount}
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right font-medium text-gray-800">
            Total: ₹{order.amount}
          </div>
        </div>
      ))}

      {orders.length > 3 && (
        <div className="flex justify-end gap-3 mt-2">
          {visibleCount < orders.length && (
            <button className="text-blue-500 hover:underline" onClick={showMore}>
              View More
            </button>
          )}
          {visibleCount > 3 && (
            <button className="text-red-500 hover:underline" onClick={showLess}>
              View Less
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Alert, Button, Spinner } from "flowbite-react";

export default function ChefOrderCard({ order, hotelId }) {
  const [items, setItems] = useState(order.items);
  const [isCompleted, setIsCompleted] = useState(
    order.items.every((item) => item.quantity === 0)
  );
  const [loading, setLoading] = useState(false);
  const [completedOnce, setCompletedOnce] = useState(isCompleted); 
  const [showSuccess, setShowSuccess] = useState(false);

  const updateQuantity = (foodName, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.foodName === foodName) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 0 };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    const checkCompletion = items.every((item) => item.quantity === 0);
    setIsCompleted(checkCompletion);

    if (checkCompletion && !completedOnce) {
      markOrderCompleted();
    }
  }, [items]);

  const markOrderCompleted = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/order/markCompleted", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          orderId: order._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
          }, 2000);
        setCompletedOnce(true); 
      } else {
        console.error("Failed to mark as completed:", data.message);
      }
    } catch (err) {
      console.error("Error marking completed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-80 bg-white shadow-lg rounded-lg p-4 border border-purple-200">
      <h3 className="text-lg font-semibold mb-2 text-purple-700">
        Floor ID: {order.floorId}
      </h3>
      <p><strong>Table ID:</strong> {order.tableId}</p>
      <p><strong>Hall Manager ID:</strong> {order.staffId}</p>

      <p className="mt-2 font-medium">Items:</p>
      <ul className="text-sm space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span>{item.foodName}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={isCompleted}
                className={`px-2 py-1 rounded ${isCompleted ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => updateQuantity(item.foodName, -1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                disabled={isCompleted}
                className={`px-2 py-1 rounded ${isCompleted ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => updateQuantity(item.foodName, 1)}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <Button size="sm" color="purple" pill>
          Call Waiter
        </Button>
        <Button
          size="sm"
          pill
          color={isCompleted ? "success" : "warning"}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : isCompleted ? "Completed" : "Pending"}
        </Button>
      </div>
      {showSuccess && (
        <Alert color="success" className="mt-4 text-sm">
          ✅ Order Completed successfully!
        </Alert>
      )}
    </div>
  );
}

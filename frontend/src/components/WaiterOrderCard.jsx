import React, { useState, useEffect } from "react";
import { Button, Checkbox } from "flowbite-react";

export default function WaiterOrderCard({ order, hotelId, onDelivered }) {
  const [items, setItems] = useState(order.items);
  const [checkedItems, setCheckedItems] = useState({});
  const [isDeliverable, setIsDeliverable] = useState(false);

  useEffect(() => {
    const updatedChecks = {};
    items.forEach((item) => {
      updatedChecks[item.foodName] = item.quantity === 0;
    });
    setCheckedItems(updatedChecks);
  }, [items]);

  useEffect(() => {
    const allChecked = Object.values(checkedItems).every((checked) => checked);
    setIsDeliverable(allChecked);
  }, [checkedItems]);

  const handleCheck = (foodName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [foodName]: !prev[foodName],
    }));
  };

  const updateQuantity = (foodName, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.foodName === foodName) {
          const newQty = Math.max(item.quantity + delta, 0);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleUpdateDelivery = async () => {
    try {
      const res = await fetch("/api/order/update-delivery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          orderId: order._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onDelivered(order._id);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating delivery:", error);
    }
  };

  return (
    <div className="bg-white border shadow-md rounded-md p-4 w-full md:w-96">
      <h2 className="text-lg font-bold text-blue-700 mb-2">Waiter Task</h2>
      <p><strong>Table ID:</strong> {order.tableId}</p>
      <p><strong>Floor ID:</strong> {order.floorId}</p>
      <p><strong>Chef ID:</strong> {order.staffId}</p>
      <p><strong>Kitchen:</strong> {order.kitchenId}</p>

      <h3 className="mt-3 font-semibold">Items:</h3>
      <ul className="mt-2 text-sm space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={checkedItems[item.foodName] || false}
                onChange={() => handleCheck(item.foodName)}
              />
              <span>{item.foodName}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.foodName, -1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.foodName, 1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Button
        className="mt-4 w-full"
        disabled={!isDeliverable}
        color="success"
        onClick={handleUpdateDelivery}
      >
        Update Delivery
      </Button>
    </div>
  );
}

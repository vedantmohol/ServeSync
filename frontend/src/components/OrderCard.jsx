import React from "react";
import { Button } from "flowbite-react";

export default function OrderCard({ order }) {
  return (
    <div className="w-full md:w-80 bg-white shadow-lg rounded-lg p-4 border border-purple-200">
      <h3 className="text-lg font-semibold mb-2 text-purple-700">
        Floor ID: {order.floorId}
      </h3>
      <p><strong>Table ID:</strong> {order.tableId}</p>
      <p><strong>Kitchen ID:</strong> {order.kitchenId}</p>
      <p className="mt-2 font-medium">Items:</p>
      <ul className="list-disc list-inside text-sm">
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.foodName} × {item.quantity} = ₹{item.amount}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-right font-semibold">
        Total: ₹{order.totalAmount}
      </p>
      <div className="flex justify-between mt-4">
        <Button size="sm" color="purple" pill>
          Add Food
        </Button>
        <Button size="sm" color="success" pill>
          Generate Bill
        </Button>
      </div>
    </div>
  );
}

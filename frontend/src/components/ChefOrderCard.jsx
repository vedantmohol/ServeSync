import React, { useEffect, useState } from "react";
import { Alert, Button, Label, Modal, Select, Spinner } from "flowbite-react";

export default function ChefOrderCard({ order, hotelId }) {
  const [items, setItems] = useState(order.items);
  const [isCompleted, setIsCompleted] = useState(
    order.items.every((item) => item.quantity === 0)
  );
  const [loading, setLoading] = useState(false);
  const [completedOnce, setCompletedOnce] = useState(isCompleted); 
  const [showSuccess, setShowSuccess] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [waiters, setWaiters] = useState([]);
  const [selectedWaiter, setSelectedWaiter] = useState("");
  const [assignMessage, setAssignMessage] = useState("");

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

  const fetchAvailableWaiters = async () => {
    try {
      const res = await fetch(`/api/hotel/available-waiters?hotelId=${hotelId}`);
      const data = await res.json();
      if (res.ok) setWaiters(data.waiters || []);
    } catch (err) {
      console.error("Error fetching waiters:", err);
    }
  };

  const handleCallWaiter = () => {
    fetchAvailableWaiters();
    setShowModal(true);
  };

  const assignWaiter = async () => {
    if (!selectedWaiter) return;
    try {
      const res = await fetch("/api/order/assign-waiter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          orderId: order._id,
          waiterId: selectedWaiter,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAssignMessage("✅ Waiter called successfully!");
        setTimeout(() => {
          setShowModal(false);
          setAssignMessage("");
          setSelectedWaiter("");
        }, 2000);
      } else {
        setAssignMessage(data.message || "❌ Failed to assign waiter");
      }
    } catch (err) {
      alert("Something went wrong while calling waiter");
    }
  };

  return (
    <div className="w-full md:w-80 bg-white shadow-lg rounded-lg p-4 border border-purple-200">
      <h3 className="text-lg font-semibold mb-2 text-purple-700">
        Floor ID: {order.floorId}
      </h3>
      <p>
        <strong>Table ID:</strong> {order.tableId}
      </p>
      <p>
        <strong>Hall Manager ID:</strong> {order.staffId}
      </p>

      <p className="mt-2 font-medium">Items:</p>
      <ul className="text-sm space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span>{item.foodName}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={isCompleted}
                className={`px-2 py-1 rounded ${
                  isCompleted
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => updateQuantity(item.foodName, -1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                disabled={isCompleted}
                className={`px-2 py-1 rounded ${
                  isCompleted
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => updateQuantity(item.foodName, 1)}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <Button size="sm" color="purple" pill onClick={handleCallWaiter}>
          Call Waiter
        </Button>
        <Button
          size="sm"
          pill
          color={isCompleted ? "success" : "warning"}
          disabled={loading}
        >
          {loading ? (
            <Spinner size="sm" />
          ) : isCompleted ? (
            "Completed"
          ) : (
            "Pending"
          )}
        </Button>
      </div>
      {showSuccess && (
        <Alert color="success" className="mt-4 text-sm">
          ✅ Order Completed successfully!
        </Alert>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header>Select Waiter</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <Label htmlFor="waiterSelect">Available Waiters</Label>
            <Select
              id="waiterSelect"
              onChange={(e) => setSelectedWaiter(e.target.value)}
              value={selectedWaiter}
              required
            >
              <option value="">-- Select Waiter --</option>
              {waiters.map((waiter) => (
                <option key={waiter.staffID} value={waiter.staffID}>
                  {waiter.name} ({waiter.staffID})
                </option>
              ))}
            </Select>

            {assignMessage && (
              <div className="text-center mt-2 text-sm font-medium text-green-600">
                {assignMessage}
              </div>
            )}
            
            <div className="flex justify-end gap-4 mt-4">
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                color="success"
                onClick={assignWaiter}
                disabled={!selectedWaiter}
              >
                Call
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

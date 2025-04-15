import React, { useState } from "react";
import { Button, Modal, Select, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OrderCard({ order }) {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const [showModal, setShowModal] = useState(false);
    const [paymentMode, setPaymentMode] = useState("");
    const [generating, setGenerating] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleGenerateBill = async () => {
      if (!paymentMode) {
        setErrorMessage("Please select a payment type.");
        return;
      }
      setGenerating(true);
      setErrorMessage("");
  
      try {
        const res = await fetch("/api/order/generateBill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hotelId: currentUser.hotelId,
            orderId: order._id,
            paymentMode,
          }),
        });
  
        const data = await res.json();
        setGenerating(false);
  
        if (!res.ok) {
          setErrorMessage(data.message || "Failed to generate bill.");
        } else {
          setSuccess(true);
          setTimeout(() => {
            setShowModal(false);
            navigate("/hall-manager-dashboard");
          }, 3000);
        }
      } catch (err) {
        setGenerating(false);
        setErrorMessage("Something went wrong.");
      }
    };

  return (
    <>
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
        <Button size="sm" color="purple"
        onClick={() =>
            navigate(
              `/hall-manager-dashboard?tab=add-order&orderId=${order._id}`
            )
          }
        pill>
          Add Food
        </Button>
        <Button size="sm" color="success" pill onClick={() => setShowModal(true)}>
          Generate Bill
        </Button>
      </div>
    </div>
    <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
    <Modal.Header />
    <Modal.Body>
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-gray-900 text-center">
          Select Payment Type
        </h3>

        <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} required>
          <option value="">-- Select Payment --</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </Select>

        {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
        {success && <Alert color="success">Bill Generated Successfully!</Alert>}

        <div className="w-full text-center">
          <Button
            color="success"
            onClick={handleGenerateBill}
            isProcessing={generating}
            disabled={generating || success}
          >
            {success ? "Success" : "Generate"}
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
  </>
  );
}

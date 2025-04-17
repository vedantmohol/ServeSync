import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Radio, Label, Alert, Modal } from "flowbite-react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCurrentOrder } from '../redux/order/orderSlice.js';

export default function ConfirmOrder({ setTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrder, additionalItems } = useSelector((state) => state.order);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const hotelId = currentOrder?.hotelId;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("tab") !== "confirm-order") {
      urlParams.set("tab", "confirm-order");
      navigate(`/cart?${urlParams.toString()}`, { replace: true });
    }
  }, [navigate, location.search]);

  const combinedItems = [
    ...(currentOrder ? [{ ...currentOrder, quantity: currentOrder.quantity || 1 }] : []),
    ...(additionalItems || []),
  ];

  const deliveryCharges = [20, 40, 60];
  const randomDelivery = deliveryCharges[Math.floor(Math.random() * deliveryCharges.length)];

  const totalAmount = combinedItems.reduce(
    (sum, item) => sum + item.food.price * (item.quantity || 1),
    0
  );

  const gstRate = 5;
  const gstAmount = (gstRate / 100) * totalAmount;
  const grandTotal = Math.round(totalAmount + 2 * gstAmount + randomDelivery);

  const handlePaymentChange = (value) => {
    setSelectedPayment((prev) => (prev === value ? "" : value));
  };

  const handlePlaceOrder = async () => {
    try {
        const allItems = [
          ...(currentOrder
            ? [
                {
                  foodName: currentOrder.food.name,
                  quantity: currentOrder.quantity || 1,
                  price: currentOrder.food.price,
                },
              ]
            : []),

          ...(additionalItems || []).map((item) => ({
            foodName: item.food?.name || item.name,
            quantity: item.quantity || 1,
            price: item.food?.price || item.price || 0,
          })),
        ];
        
      const orderPayload = {
        adminEmail: currentOrder?.adminEmail,
        userEmail: currentUser?.email,
        items: allItems,
      };

      const res = await fetch("/api/order/place-online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok) {
        setEstimatedTime(data.estimatedTime);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          dispatch(clearCurrentOrder());
          navigate("/");
        }, 3000);
      } else {
        setSuccessMsg(data.message || "Failed to place order");
      }
    } catch (err) {
      setSuccessMsg("Something went wrong while placing order");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-8">Confirm Your Order</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          <ul className="space-y-2">
            {combinedItems.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span>{item.food.name} × {item.quantity || 1}</span>
                <span>₹{item.food.price * (item.quantity || 1)}</span>
              </li>
            ))}
          </ul>

          <hr className="my-4" />

          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST ({gstRate}%):</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST ({gstRate}%):</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span>₹{randomDelivery}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Payable Amount:</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="border p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>

          <div className="space-y-5">
            {["Cash on Delivery", "Card", "UPI"].map((method) => (
              <div key={method} className="flex items-center gap-3 text-lg">
                <Radio
                  name="payment"
                  value={method}
                  checked={selectedPayment === method}
                  onChange={() => handlePaymentChange(method)}
                />
                <Label className="text-lg">{method}</Label>
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-4 mt-8">
            <Button
              color="success"
              disabled={selectedPayment !== "Cash on Delivery"}
              onClick={handlePlaceOrder}
              className="w-full"
            >
              Place Order
            </Button>

            <Button
              color="gray"
              className="w-full"
              onClick={() => {
                setTab("cart");
                navigate("/cart?tab=cart");
              }}
            >
              Go to Cart
            </Button>
          </div>

          {successMsg && (
            <Alert color="failure" className="mt-4">
              {successMsg}
            </Alert>
          )}
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Body>
          <div className="text-center p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Your order will be delivered in {estimatedTime} minutes!
            </h3>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { clearCurrentOrder } from "../redux/order/orderSlice";

function CustomerBill({ setTab }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, additionalItems } = useSelector((state) => state.order);

  const combinedItems = [
    ...(currentOrder
      ? [{ ...currentOrder, quantity: currentOrder.quantity || 1 }]
      : []),
    ...(additionalItems || []),
  ];

  const totalAmount = combinedItems.reduce(
    (total, item) => total + item.food.price * (item.quantity || 1),
    0
  );

  return (
    <div className="w-full px-4 ">
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Total Bill
        </h2>

        {combinedItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-2"
          >
            <div className="flex flex-col">
              <span className="font-medium">{item.food.name}</span>
              <span className="text-sm text-gray-500">
                ₹{item.food.price} × {item.quantity || 1}
              </span>
            </div>
            <span className="font-semibold text-teal-600">
              ₹{item.food.price * (item.quantity || 1)}
            </span>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
          <span>Total Amount:</span>
          <span className="text-teal-700">₹{totalAmount}</span>
        </div>

        {currentOrder?.hotelName && (
          <p className="text-sm mt-4 text-gray-600 italic">
            Restaurant:{" "}
            <span className="font-medium">{currentOrder.hotelName}</span>
          </p>
        )}

        <Button
          className="mt-6 w-full"
          gradientDuoTone="purpleToBlue"
          onClick={() => setTab("confirm-order")}
          outline
        >
          Proceed to Pay
        </Button>
        <Button
          className="mt-4 w-full"
          color="failure"
          onClick={() => {
            dispatch(clearCurrentOrder());
            navigate("/");
          }}
        >
          Cancel Order
        </Button>
      </div>
    </div>
  );
}

export default CustomerBill;

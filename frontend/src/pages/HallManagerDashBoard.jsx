import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TakeOrder from "../components/TakeOrder";
import OrderCard from "../components/OrderCard";
import AddOrder from "../components/AddOrder";

function HallManagerDashBoard() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "");
  }, [location.search]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `/api/order/getManagerOrders?hotelId=${currentUser.hotelId}&staffId=${currentUser.staffId}`
        );
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error fetching manager orders:", err);
      }
    };

    if (currentUser?.role === "hall_manager" && tab !== "take-order") {
      fetchOrders();
    }
  }, [currentUser, tab]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {tab === "take-order" ? (
        <TakeOrder />
      ) : tab === "add-order" ? ( 
        <AddOrder />
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center text-purple-800">
            Ongoing Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No ongoing orders yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
              {orders.map((order, idx) => (
                <OrderCard key={idx} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HallManagerDashBoard;
import React, { useState } from "react";
import CurrentOrder from "../components/CurrentOrder";
import { useSelector } from "react-redux";
import CustomerBill from "../components/CustomerBill";
import ConfirmOrder from "../components/ConfirmOrder";

export default function Cart() {
  const { currentOrder } = useSelector((state) => state.order);
  const [tab, setTab] = useState("cart");

  if (tab === "confirm-order") {
    return <ConfirmOrder setTab={setTab} />;
  }

  return (
    <div className="w-[90%] mx-auto my-10 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[75%]">
        <CurrentOrder />
      </div>

      <div className="w-full lg:w-[25%]">
        <CustomerBill setTab={setTab}/>
      </div>
    </div>
  );
}

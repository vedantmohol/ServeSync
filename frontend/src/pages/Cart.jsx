import React from "react";
import CurrentOrder from "../components/CurrentOrder";
import { useSelector } from "react-redux";
import CustomerBill from "../components/CustomerBill";

export default function Cart() {
  const { currentOrder } = useSelector((state) => state.order);

  return (
    <div className="w-[90%] mx-auto my-10 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[75%]">
        <CurrentOrder />
      </div>

      <div className="w-full lg:w-[25%]">
        <CustomerBill />
      </div>
    </div>
  );
}

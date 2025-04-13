import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import TakeOrder from "../components/TakeOrder";

function HallManagerDashBoard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(()=>{
          const urlParams = new URLSearchParams(location.search);
          const tabFromUrl = urlParams.get('tab');
          setTab(tabFromUrl);
      },[location.search, currentUser, navigate]);

  return (
  <div>
        { tab === "take-order" && currentUser?.role === "hall_manager" && <TakeOrder/>}
  </div>
  );
}

export default HallManagerDashBoard;

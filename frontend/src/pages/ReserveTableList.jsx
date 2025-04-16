import React, { useEffect, useState } from "react";
import HotelCard from "../components/HotelCard";
import { useLocation } from "react-router-dom";
import ReserveTable from "../components/ReserveTable";

export default function ReserveTableList() {
  const [hotels, setHotels] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tab = urlParams.get("tab");
  const selectedHotelName = urlParams.get("hotelName");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotel/get");
        const data = await res.json();
        setHotels(data.hotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []);

  const selectedHotel = hotels.find((h) => h.hotelName === selectedHotelName);
  const displayedHotels = showAll ? hotels : hotels.slice(0, 9);

  if (tab === "reserve-table" && selectedHotel) {
    return <ReserveTable hotel={selectedHotel} mode="reserve" />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">
        Book a Table
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
        {displayedHotels.map((hotel, idx) => (
          <HotelCard key={idx} hotel={hotel} mode="reserve" />
        ))}
      </div>

      {hotels.length > 9 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
}

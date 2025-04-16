import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HotelCard from "../components/HotelCard";
import Restaurant from "../components/Restaurant";

function RestaurantList() {
  const [hotels, setHotels] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tab = urlParams.get("tab");
  const selectedHotel = location.state?.hotel;

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

  const displayedHotels = showAll ? hotels : hotels.slice(0, 9);

  if (tab === "restaurant" && selectedHotel) {
    return <Restaurant hotel={selectedHotel} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">
        All Restaurants
      </h2>

      {hotels.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            {displayedHotels.map((hotel, idx) => (
              <HotelCard key={idx} hotel={hotel} />
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
        </>
      ) : (
        <p className="text-center text-gray-500">No restaurants found.</p>
      )}
    </div>
  );
}

export default RestaurantList;

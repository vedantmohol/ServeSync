import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import CommentSection from "./CommentSection";

export default function Restaurant({ hotel }) {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchHotelFoods = async () => {
      try {
        const res = await fetch(`/api/food/get?hotelName=${encodeURIComponent(hotel.hotelName)}`);
        const data = await res.json();
        setFoods(data.foods || []);
      } catch (err) {
        console.error("Failed to fetch food items:", err);
      }
    };
    if (hotel?.hotelName) fetchHotelFoods();
  }, [hotel]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-6 items-start">
        <img
          src={hotel.hotelPhoto}
          alt={hotel.hotelName}
          className="w-full md:w-[260px] h-[320px] object-cover rounded-md"
        />

        <div className="flex-1 pt-10 pl-10">
          <h2 className="text-4xl p-3 font-bold">{hotel.hotelName}</h2>
          <p className="text-lg text-gray-600 p-3 capitalize">
            Type: {hotel.hotelType}
          </p>
          <p className="text-md text-gray-700 pl-3">📍 {hotel.hotelAddress}</p>
          <p className="text-md text-gray-700 pl-3">📞 {hotel.phone}</p>
        </div>
      </div>
      <h3 className="text-2xl font-semibold mt-10 mb-4">Dishes Available</h3>
      {foods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
          {foods.map((item, idx) => (
            <FoodCard key={idx} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No food items found for this restaurant.
        </p>
      )}

      <CommentSection hotelId={hotel.hotelId} />
    </div>
  );
}

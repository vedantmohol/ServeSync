import React, { useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import HotelCard from "../components/HotelCard";
import ImageSlider from "../components/ImageSlider";

function Home() {
  const [foods, setFoods] = useState([]);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch("/api/food/get");
        const data = await res.json();
        setFoods(data.foods);
      } catch (error) {
        console.error("Error fetching food:", error);
      }
    };

    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotel/get");
        const data = await res.json();
        setHotels(data.hotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchFoods();
    fetchHotels();
  }, []);

  return (
    <>
    <ImageSlider/>
    <hr className="my-10 border-t-2 border-gray-300" />
    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-3">
      {foods && foods.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold mt-10">
            DISHES RECOMMENDED FOR YOU
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            {foods.map((item, idx) => (
              <FoodCard key={idx} item={item} />
            ))}
          </div>
        </div>
      )}

      <hr className="my-10 border-t-2 border-gray-300" />

      {hotels && hotels.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold mt-10">
            TOP RESTAURANTS FOR YOU
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            {hotels.map((hotel, idx) => (
              <HotelCard key={idx} hotel={hotel} />
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Home;

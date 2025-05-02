import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FoodCard from "../components/FoodCard";

function SearchFood() {
  const [sidebarData, setSidebarData] = useState({
    foodName: "",
    hotelName: "",
    dishType: "",
    category: "",
    order: "desc",
  });

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const newSidebarData = {
      foodName: urlParams.get("foodName") || "",
      hotelName: urlParams.get("hotelName") || "",
      dishType: urlParams.get("dishType") || "",
      category: urlParams.get("category") || "",
      order: urlParams.get("order") || "desc",
    };
    setSidebarData(newSidebarData);

    const fetchFoods = async () => {
      setLoading(true);
      const queryString = new URLSearchParams(newSidebarData).toString();
      const res = await fetch(`/api/food/get?${queryString}`);
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setFoods(data.foods);
        setShowMore(data.foods.length === 9);
      }
    };

    fetchFoods();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(sidebarData).toString();
    navigate(`/search?${query}`);
  };

  const handleShowMore = async () => {
    const startIndex = foods.length;
    const query = new URLSearchParams({
      ...sidebarData,
      startIndex,
    }).toString();
    const res = await fetch(`/api/food/getfoods?${query}`);
    const data = await res.json();

    if (res.ok) {
      setFoods((prev) => [...prev, ...data.foods]);
      setShowMore(data.foods.length === 9);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-6 md:border-r w-full md:max-w-xs border-gray-300">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <TextInput
            id="foodName"
            placeholder="Search food name"
            value={sidebarData.foodName}
            onChange={handleChange}
            shadow
          />
          <TextInput
            id="hotelName"
            placeholder="Search hotel"
            value={sidebarData.hotelName}
            onChange={handleChange}
            shadow
          />
          <Select id="dishType" value={sidebarData.dishType} onChange={handleChange}>
            <option value="">All Dish Types</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </Select>
          <Select id="category" value={sidebarData.category} onChange={handleChange}>
            <option value="">All Categories</option>
            <option value="Starter">Starter</option>
            <option value="Main Course">Main Course</option>
            <option value="Dessert">Dessert</option>
          </Select>
          <Select id="order" value={sidebarData.order} onChange={handleChange}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </Select>
          <Button type="submit" gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>

      <div className="w-full">
        <h1 className="text-2xl font-bold text-center mt-6 mb-4 text-gray-800">Search Results</h1>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!loading && foods.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">No results found</p>
          )}
          {loading && (
            <p className="text-center text-gray-500 col-span-full">Loading...</p>
          )}
          {foods.map((item, idx) => (
            <FoodCard key={idx} item={item} />
          ))}
        </div>
        {showMore && (
          <div className="flex justify-center mt-6 mb-12">
            <Button onClick={handleShowMore}>Show More</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchFood;

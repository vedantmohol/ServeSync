import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function SimilarDishes() {
  const { currentOrder } = useSelector((state) => state.order);
  const [dishes, setDishes] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2);

  const [quantities, setQuantities] = useState({});
  const [added, setAdded] = useState({});

  useEffect(() => {
    const fetchSimilarDishes = async () => {
      if (!currentOrder) return;
      try {
        const res = await fetch(`/api/food/get?adminEmail=${currentOrder.adminEmail}&limit=100`);
        const data = await res.json();

        const similar = data.foods.filter(
          (item) => 
            item.food.name !== currentOrder.food.name &&
            item.food.dishType === currentOrder.food.dishType
        );
        setDishes(similar);

      } catch (error) {
        console.error("Error fetching similar dishes:", error);
      }
    };

      fetchSimilarDishes();
    
  }, [currentOrder]);

  const handleAddClick = (index) => {
    setAdded((prev) => ({ ...prev, [index]: true }));
    setQuantities((prev) => ({ ...prev, [index]: 1 }));
  };

  const handleQuantityChange = (index, type) => {
    setQuantities((prev) => {
      const currentQty = prev[index] || 1;
  
      if (type === 'dec') {
        if (currentQty <= 1) {
          setAdded((prevAdded) => {
            const updated = { ...prevAdded };
            delete updated[index];
            return updated;
          });
  
          const updatedQuantities = { ...prev };
          delete updatedQuantities[index];
          return updatedQuantities;
        }
  
        return { ...prev, [index]: currentQty - 1 };
      }
  
      return { ...prev, [index]: currentQty + 1 };
    });
  };
  

  const rowsToShow = dishes.slice(0, visibleRows * 2);

  const handleViewMore = () => {
    setVisibleRows((prev) => Math.min(prev + 1, 10));
  };

  if (!currentOrder) return null;

  return (
    <div className="w-full mt-6">
      <h3 className="text-lg font-semibold mb-4">Similar Dishes from {currentOrder.hotelName}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rowsToShow.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 shadow hover:shadow-md transition"
          >
            <img
              src={item.food.image}
              alt={item.food.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h4 className="text-md font-bold">{item.food.name}</h4>
            <p className="text-sm text-gray-600">{item.food.description}</p>
            <p className="text-sm font-medium">₹{item.food.price}</p>

            {added[index] ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(index, 'dec')}
                  className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-lg">{quantities[index]}</span>
                <button
                  onClick={() => handleQuantityChange(index, 'inc')}
                  className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddClick(index)}
                className="w-full mt-2 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 py-2 rounded-md"
              >
                Add
              </button>
            )}
          </div>
        ))}
      </div>
      {visibleRows < 10 && dishes.length > visibleRows * 2 && (
        <div className="text-right mt-4">
          <button
            onClick={handleViewMore}
            className="text-blue-500 hover:underline"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
}

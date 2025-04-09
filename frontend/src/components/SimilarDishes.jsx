import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToAdditionalItems,
  removeFromAdditionalItems,
  updateAdditionalItemQuantity,
} from '../redux/order/orderSlice.js';

export default function SimilarDishes() {
   const dispatch = useDispatch();
  const { currentOrder, additionalItems = [] } = useSelector((state) => state.order);
  const [dishes, setDishes] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2);

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
  
  const rowsToShow = dishes.slice(0, visibleRows * 2);

  const isAdded = (foodName) => {
    return additionalItems.some((i) => i.food.name === foodName);
  };

  const getQuantity = (foodName) => {
    return additionalItems.find((i) => i.food.name === foodName)?.quantity || 1;
  };

  const handleViewMore = () => {
    setVisibleRows((prev) => Math.min(prev + 1, 10));
  };

  if (!currentOrder) return null;

  return (
    <div className="w-full mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Similar Dishes from {currentOrder?.hotelName}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rowsToShow.map((item, index) => {
          const added = isAdded(item.food.name);
          const quantity = getQuantity(item.food.name);

          return (
            <div key={index} className="border rounded-lg p-3 shadow hover:shadow-md transition">
              <img
                src={item.food.image}
                alt={item.food.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h4 className="text-md font-bold">{item.food.name}</h4>
              <p className="text-sm text-gray-600">{item.food.description}</p>
              <p className="text-sm font-medium">₹{item.food.price}</p>

              {added ? (
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => {
                      if (quantity === 1) {
                        dispatch(removeFromAdditionalItems(item.food.name));
                      } else {
                        dispatch(updateAdditionalItemQuantity({ foodName: item.food.name, type: 'dec' }));
                      }
                    }}
                    className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(updateAdditionalItemQuantity({ foodName: item.food.name, type: 'inc' }))
                    }
                    className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (item && item.food) {
                      dispatch(addToAdditionalItems(item));
                    }
                  }}
                  className="w-full mt-2 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 py-2 rounded-md"
                >
                  Add
                </button>
              )}
            </div>
          );
        })}
      </div>
      {visibleRows < 10 && dishes.length > visibleRows * 2 && (
        <div className="text-right mt-4">
          <button onClick={handleViewMore} className="text-blue-500 hover:underline">
            View More
          </button>
        </div>
      )}
    </div>
  );
}

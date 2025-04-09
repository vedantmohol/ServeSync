import React, { useState } from 'react';
import SimilarDishes from './SimilarDishes';
import { useSelector } from 'react-redux';

export default function CurrentOrder(){
    const [quantity, setQuantity] = useState(1);
    const { currentOrder } = useSelector((state) => state.order);
    const [added, setAdded] = useState(true);

    if (!currentOrder) return <p>No food item selected.</p>;

    const { food, hotelName } = currentOrder;

    const handleQuantityChange = (type) => {
      setQuantity((prev) => {
        if (type === 'inc') return prev + 1;
        if (prev === 1) {
          setAdded(false); 
          return 1;
        }
        return prev - 1;
      });
    }

    const handleAddClick = () => {
      setQuantity(1);
      setAdded(true);
    }

    return (
        <div className="w-full px-4 lg:px-0 lg:w-[75%] mx-auto ">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Current Order</h2>
    
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={food.image}
              alt={food.name}
              className="w-full md:w-[200px] h-[200px] object-cover rounded-lg"
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">{food.name}</h3>
              <p className="text-gray-600 text-sm">{hotelName}</p>
              <p className="text-gray-500 text-sm">Type: {food.dishType}</p>
              <p className="text-lg font-medium text-teal-700">₹{food.price}</p>
    
              {added ? (
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => handleQuantityChange('dec')}
                  className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('inc')}
                  className="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddClick}
                className="mt-2 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md"
              >
                Add
              </button>
            )}
            </div>
          </div>

          <SimilarDishes/>
        </div>
        </div>
      );
    }
import React from 'react';
import SimilarDishes from './SimilarDishes';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentOrderQuantity } from '../redux//order/orderSlice.js';
import { useNavigate } from 'react-router-dom';

export default function CurrentOrder(){
    const dispatch = useDispatch();
    const { currentOrder } = useSelector((state) => state.order);
    const navigate = useNavigate();

    if (!currentOrder) {
      return (
        <>
        <div className="flex flex-col justify-center items-center h-40">
        <p>No food item selected.</p>
          <button
            onClick={() => navigate("/restaurants")}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            Grab Dishes
          </button>
        </div>
        </>
      );
    }
    const { food, hotelName,quantity } = currentOrder;

    const handleQuantityChange = (type) => {
      dispatch(updateCurrentOrderQuantity(type));
    };

    return (
      <div className="w-full px-4 lg:px-0 lg:w-[75%] mx-auto">
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
            </div>
          </div>
  
          <SimilarDishes />
        </div>
      </div>
    );
    }
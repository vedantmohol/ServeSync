import React from 'react';
import CurrentOrder from '../components/CurrentOrder';
import { useSelector } from 'react-redux';

export default function Cart(){
  const { currentOrder } = useSelector((state) => state.order);

    return (
        <div className="w-[90%] mx-auto my-10 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[75%]">
            <CurrentOrder/>
          </div>
        </div>
      );
}
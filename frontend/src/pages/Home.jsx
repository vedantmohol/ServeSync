import React, { useEffect, useState } from 'react'
import FoodCard from '../components/FoodCard';

function Home() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch('/api/food/get');
        const data = await res.json();
        setFoods(data.foods);
      } catch (error) {
        console.error('Error fetching food:', error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-3'>
      {foods && foods.length > 0 && (
        <div className='flex flex-col gap-6'>
          <h2 className='text-2xl font-semibold mt-10'>DISHES RECOMMENDED FOR YOU</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center'>
            {foods.map((item, idx) => (
              <FoodCard key={idx} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'flowbite-react';

export default function HotelCard({ hotel }) {
  const { hotelPhoto, hotelName, hotelType, phone } = hotel;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleDetailHotelPage = () => {
    if (!currentUser) {
      setShowModal(true);
    } else {
      navigate('/restaurants?tab=restaurant', { state: { hotel } });
    }
  };

  return (
    <>
    <div className='group relative w-full border border-purple-500 hover:border-2 h-[370px] overflow-hidden rounded-lg sm:w-[300px] md:w-[320px] transition-all mx-auto'>
        <img
          src={hotelPhoto}
          alt='Hotel'
          className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
        <div className='p-3 flex flex-col gap-2'>
          <p className='text-lg font-semibold line-clamp-1'>{hotelName}</p>
          <p className='text-sm text-gray-600 capitalize'>{hotelType}</p>
          <p className='font-medium text-sm text-gray-800 mt-auto'>📞 {phone}</p>
          <button
            onClick={handleDetailHotelPage}
            className='mt-2 border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md'
          >
            View Restaurant
          </button>
        </div>
      </div>
      
    <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Please login to visit.
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="success" onClick={() => navigate('/sign-in')}>
                    Sign In
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    Go Back
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
    </>
  );
}

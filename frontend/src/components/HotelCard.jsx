import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'flowbite-react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

export default function HotelCard({ hotel, mode = 'restaurant' }) {
  const { hotelPhoto, hotelName, hotelType, phone,totalRatingStars = 0, comments = [], } = hotel;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleDetailHotelPage = () => {
    if (!currentUser) {
      setShowModal(true);
    } else {
      const tab = mode === "reserve" ? "reserve-table" : "restaurant";
    const path = mode === "reserve" ? "/reservetable" : "/restaurants";

    navigate(`${path}?tab=${tab}&hotelName=${encodeURIComponent(hotelName)}`, {
      state: { hotel },
    })
  };
}

  const avgRating = comments.length > 0 ? totalRatingStars / comments.length : 0;
  const rounded = avgRating.toFixed(1);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1 mt-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-gray-300" />
        ))}
        {comments.length > 0 && (
          <span className="text-xs text-gray-600 ml-1">
            {rounded}/5 ({comments.length})
            </span>
        )}
      </div>
    );
  };

const buttonText = mode === 'reserve' ? 'Book Table' : 'View Restaurant';
  return (
    <>
    <div className='group relative w-full border border-purple-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[300px] md:w-[320px] transition-all mx-auto'>
        <img
          src={hotelPhoto}
          alt='Hotel'
          className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
        <div className='p-3 flex flex-col gap-2'>
          <p className='text-lg font-semibold line-clamp-1'>{hotelName}</p>
          <p className='text-sm text-gray-600 capitalize'>{hotelType}</p>
          {renderStars(avgRating)}
          <p className='font-medium text-sm text-gray-800 mt-auto'>📞 {phone}</p>
          <button
            onClick={handleDetailHotelPage}
            className='mt-2 border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md'
          >
            {buttonText}
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

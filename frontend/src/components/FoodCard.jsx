import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'flowbite-react';
import { setCurrentOrder } from '../redux/order/orderSlice';

export default function FoodCard({ item }){
    const { food, hotelName } = item;
    const [showModal, setShowModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleAddToCart = () => {
      if (!currentUser) {
        setShowModal(true);
      } else if (currentUser.role !== "customer") {
        setShowRoleModal(true);
      } else {
        dispatch(setCurrentOrder(item));
        navigate("/cart");
        setShowModal(false);
      }
    };

    return (
        <>
        <div className='group relative w-full border border-teal-500 hover:border-2 h-[370px] overflow-hidden rounded-lg sm:w-[300px] md:w-[320px] transition-all mx-auto'>
          <img
            src={food.image}
            alt='Food'
            className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
          />
          <div className='p-3 flex flex-col gap-2'>
            <p className='text-lg font-semibold line-clamp-1'>{food.name}</p>
            <div className='text-sm text-black-600 mt-auto'>
              <p>{hotelName} 
                <span className=' text-sm text-gray-500 m-2'>({food.dishType}) </span>
              </p>
            </div>
            <p className='font-medium'>₹ {food.price}</p>
            <button
            onClick={handleAddToCart}
            className='mt-2 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md'
          >
            Add to Cart
          </button>
          </div>
        </div>
        <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Please login to order.
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

      <Modal show={showRoleModal} onClose={() => setShowRoleModal(false)} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              You must have a customer login to place an order.
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={() => setShowRoleModal(false)}>
                Go Back
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      </>
      );
}
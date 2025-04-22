import { Modal, Table, Button, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function ViewDishes() {
  const { currentUser } = useSelector((state) => state.user);
  const [dishes, setDishes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(`/api/food/get?hotelId=${currentUser.hotelId}&limit=100`);
        const data = await res.json();
        if (res.ok && data.foods.length > 0) {
          const items = data.foods.map((f) => ({
            ...f.food,
            hotelName: f.hotelName,
            hotelAddress: f.hotelAddress,
            adminEmail: f.adminEmail,
          }));
          setDishes(items);
        }
      } catch (error) {
        console.error('Failed to fetch dishes:', error.message);
      }
    };

    if (currentUser?.hotelId) fetchDishes();
  }, [currentUser]);

  const handleDelete = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/food/delete/${dishToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setDishes((prev) => prev.filter((item) => item._id !== dishToDelete));
        setSuccessMsg('Dish deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting dish:', error.message);
    }
  };

  return (
    <div className="overflow-x-auto p-3 max-w-6xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Dishes List</h1>

      {successMsg && (
        <Alert color="success" className="mb-4">
          {successMsg}
        </Alert>
      )}

      {dishes.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Photo</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Dish Type</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Updated At</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {dishes.slice(0, visibleCount).map((dish) => (
                <Table.Row key={dish._id} className="bg-white">
                  <Table.Cell className="font-medium">{dish.name}</Table.Cell>
                  <Table.Cell>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-16 h-10 object-cover rounded"
                    />
                  </Table.Cell>
                  <Table.Cell className="max-w-xs truncate">{dish.description}</Table.Cell>
                  <Table.Cell>{dish.dishType}</Table.Cell>
                  <Table.Cell>₹{dish.price}</Table.Cell>
                  <Table.Cell>{new Date(dish.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/admin/edit-dish/${dish._id}`} className="text-blue-500 hover:underline">
                      Edit
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => {
                        setDishToDelete(dish._id);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <div className="flex justify-center gap-4 mt-4">
            {visibleCount < dishes.length && (
              <Button
                size="xs"
                gradientDuoTone="purpleToPink"
                onClick={() => setVisibleCount((prev) => prev + 3)}
              >
                View More
              </Button>
            )}
            {visibleCount > 10 && (
              <Button
                size="xs"
                gradientDuoTone="purpleToBlue"
                onClick={() => setVisibleCount((prev) => Math.max(10, prev - 3))}
              >
                View Less
              </Button>
            )}
          </div>
        </>
      ) : (
        <p>No dishes found!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-600">Are you sure you want to delete this dish?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, Delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

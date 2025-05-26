import {
  TextInput,
  Label,
  Button,
  Select,
  Alert,
  Spinner,
  Modal,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditDish() {
  const { foodId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    dishType: "Veg",
    price: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const res = await fetch(
          `/api/food/get/${currentUser.hotelId}/${foodId}`
        );
        const data = await res.json();
        if (res.ok) {
          setFormData(data.dish);
        } else {
          setErrorMsg(data.message || "Failed to fetch dish details.");
        }
      } catch (err) {
        setErrorMsg("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.hotelId && foodId) {
      fetchDish();
    }
  }, [currentUser, foodId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `/api/food/update/${currentUser.hotelId}/${foodId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSuccessModal(true);
      } else {
        setErrorMsg(data.message || "Failed to update dish.");
      }
    } catch (err) {
      setErrorMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessModal(false);
    navigate("/viewdishes");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Dish</h2>

      {errorMsg && (
        <Alert color="failure" className="mb-4">
          {errorMsg}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-6">
          <Spinner size="xl" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name" value="Dish Name" />
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="type" value="Dish Type (e.g., Starter, Main)" />
            <TextInput
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category" value="Category (e.g., Indian, Chinese)" />
            <TextInput
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="dishType" value="Dish Type (Veg / Nonveg)" />
            <Select
              id="dishType"
              name="dishType"
              value={formData.dishType}
              onChange={handleChange}
              required
            >
              <option value="Veg">Veg</option>
              <option value="Nonveg">Nonveg</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="price" value="Price (₹)" />
            <TextInput
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" value="Description" />
            <TextInput
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="image" value="Image URL" />
            <TextInput
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" gradientDuoTone="purpleToPink" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Updating...</span>
              </>
            ) : (
              "Update Dish"
            )}
          </Button>
        </form>
      )}

      <Modal show={successModal} onClose={handleClose}>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-green-600 mb-4">
            Dish updated successfully!
          </h3>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={handleClose} className="bg-blue-500 text-white">
              Go to Dishes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

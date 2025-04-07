import React, { useState } from "react";
import {
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  Textarea,
  TextInput,
} from "flowbite-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addFoodStart,
  addFoodSuccess,
  addFoodFailure,
} from "../redux/food/foodSlice.js";

function AddFood() {
  const [hotelId, setHotelId] = useState("");
  const [food, setFood] = useState([
    {
      name: "",
      type: "",
      category: "",
      description: "",
      dishType: "Veg",
      price: "",
      image: "",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFoodChange = (index, field, value) => {
    const updatedFood = [...food];
    updatedFood[index][field] = value;
    setFood(updatedFood);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage(null);
      dispatch(addFoodStart());

      const res = await fetch("/api/food/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hotelId, food }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(addFoodFailure(data.message || "Failed to add food."));
        setLoading(false);
        return setErrorMessage(data.message);
      } else {
        dispatch(addFoodSuccess("Food added successfully."));
        setLoading(false);
        setShowModal(true);
      }
    } catch (err) {
      setErrorMessage(error.message);
      setLoading(false);
      dispatch(addFoodFailure("Something went wrong."));
    }
  };

  const handleYes = () => {
    setFood([
      {
        name: "",
        type: "",
        category: "",
        description: "",
        dishType: "Veg",
        price: "",
        image: "",
      },
    ]);
    setHotelId("");
    setShowModal(false);
  };

  const handleNo = () => {
    navigate("/dashboard?tab=admin-dashboard");
  };

  return (
    <div className="p-6 w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Food</h2>
      <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label value="Hotel ID" />
          <TextInput
            type="text"
            placeholder="Hotel ID"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            required
          />
        </div>

        {food.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg bg-gray-50 space-y-2"
          >
            <h3 className="font-semibold mb-2">Dish {index + 1}</h3>

            <div>
              <Label value="Name" />
              <TextInput
                type="text"
                placeholder="Enter Dish Name"
                value={item.name}
                onChange={(e) =>
                  handleFoodChange(index, "name", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label value="Type" />
              <TextInput
                type="text"
                placeholder="Eg: Punjabi, Chinese..."
                value={item.type}
                onChange={(e) =>
                  handleFoodChange(index, "type", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label value="Category" />
              <TextInput
                type="text"
                placeholder="Starter, Main Course, Dessert"
                value={item.category}
                onChange={(e) =>
                  handleFoodChange(index, "category", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label value="Description" />
              <Textarea
                placeholder="Eg: Spicy hot cooked with oil"
                value={item.description}
                onChange={(e) =>
                  handleFoodChange(index, "description", e.target.value)
                }
              />
            </div>

            <div>
              <Label value="Dish Type" />
              <Select
                value={item.dishType}
                onChange={(e) =>
                  handleFoodChange(index, "dishType", e.target.value)
                }
                required
              >
                <option value="Veg">Veg</option>
                <option value="Nonveg">Nonveg</option>
              </Select>
            </div>

            <div>
              <Label value="Price" />
              <TextInput
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  handleFoodChange(index, "price", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label value="Image URL" />
              <TextInput
                type="text"
                placeholder="Image URL"
                value={item.image}
                onChange={(e) =>
                  handleFoodChange(index, "image", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <Button type="submit" gradientDuoTone="purpleToPink" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Adding...</span>
            </>
          ) : (
            "Add Food"
          )}
        </Button>
      </form>
      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4 text-green-600">
            Food added successfully!
          </h3>
          <p className="mb-6">Want to add another dish?</p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleYes}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Yes
            </Button>
            <Button
              onClick={handleNo}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddFood;

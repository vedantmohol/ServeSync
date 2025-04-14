import React, { useEffect, useState } from "react";
import { Button, Label, Select, Spinner, Alert } from "flowbite-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddOrder() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const hotelId = currentUser.hotelId;
  const orderId = new URLSearchParams(location.search).get("orderId");

  const [orderData, setOrderData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [foodsByCategory, setFoodsByCategory] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `/api/order/getManagerOrders?hotelId=${hotelId}&staffId=${currentUser.staffId}`
        );
        const data = await res.json();
        if (res.ok) {
          const existing = data.orders.find((o) => o._id === orderId);
          setOrderData(existing);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };
    fetchOrder();
  }, [hotelId, currentUser.staffId, orderId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/food/get?hotelId=${hotelId}&limit=100`);
        const data = await res.json();
        if (res.ok) {
          const allFoods = data.foods.map((f) => f.food);
          const categoryList = [...new Set(allFoods.map((f) => f.category))];
          setCategories(categoryList);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, [hotelId]);

  useEffect(() => {
    if (!selectedCategory) return;
    const fetchFoodItems = async () => {
      try {
        const res = await fetch(
          `/api/food/get?hotelId=${hotelId}&category=${selectedCategory}&limit=100`
        );
        const data = await res.json();
        if (res.ok) {
          const items = data.foods.map((f) => f.food);
          setFoodsByCategory(items);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchFoodItems();
  }, [selectedCategory, hotelId]);

  const handleSelectFood = (food) => {
    setSelectedFoods((prev) => {
      const exists = prev.find((f) => f.name === food.name);
      if (exists) {
        return prev.map((f) =>
          f.name === food.name ? { ...f, quantity: f.quantity + 1 } : f
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (name, delta) => {
    setSelectedFoods((prev) =>
      prev
        .map((item) => {
          if (item.name === name) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/order/updateOrder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          hotelId,
          items: selectedFoods.map((item) => ({
            foodName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to add food.");
      } else {
        setSuccessMessage("Food added successfully!");
        setTimeout(() => {
          navigate("/hall-manager-dashboard");
        }, 1500);
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("Something went wrong.");
    }
  };

  if (!orderData) return <p>Loading order data...</p>;

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add Food to Order
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label value="Floor ID" />
            <input
              value={orderData.floorId}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <Label value="Table ID" />
            <input
              value={orderData.tableId}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <Label value="Kitchen ID" />
            <input
              value={orderData.kitchenId}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <Label value="Select Category" />
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>

        {foodsByCategory.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {foodsByCategory.map((item) => (
              <button
                type="button"
                key={item.name}
                className="border border-purple-500 rounded px-4 py-2 text-purple-600 hover:bg-purple-600 hover:text-white"
                onClick={() => handleSelectFood(item)}
              >
                {item.name} - ₹{item.price}
              </button>
            ))}
          </div>
        )}

        {selectedFoods.length > 0 && (
          <>
            <h3 className="font-medium mt-4 mb-2">Selected Items</h3>
            <ul className="space-y-2">
              {selectedFoods.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center border rounded p-3"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.quantity} = ₹
                      {item.price * item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.name, -1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.name, 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            disabled={loading}
            outline
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-2">Adding Food...</span>
              </>
            ) : (
              "Add to Order"
            )}
          </Button>
        </div>
        {successMessage && <Alert color="success">{successMessage}</Alert>}
        {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
      </form>
    </div>
  );
}

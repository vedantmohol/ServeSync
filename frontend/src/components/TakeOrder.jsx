import React, { useEffect, useState } from "react";
import { Button, Label, Select, Spinner, Alert } from "flowbite-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function TakeOrder() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const hotelId = currentUser.hotelId;

  const [floors, setFloors] = useState([]);
  const [floorId, setFloorId] = useState("");
  const [tableId, setTableId] = useState("");
  const [tables, setTables] = useState([]);

  const [kitchens, setKitchens] = useState([]);
  const [kitchenId, setKitchenId] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [foodsByCategory, setFoodsByCategory] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const res = await fetch(`/api/order/getStructure?hotelId=${hotelId}`);
        const data = await res.json();
        if (res.ok) {
          setFloors(data.floors);
          setKitchens(data.kitchens);

          if (data.floors.length === 1) {
            setFloorId(data.floors[0].floorId);
            setTables(data.floors[0].tables || []);
          }
        }
      } catch (err) {
        console.error("Error fetching structure:", err);
      }
    };
    fetchStructure();
  }, [hotelId]);

  useEffect(() => {
    const floor = floors.find((f) => f.floorId === floorId);
    setTables(floor ? floor.tables : []);
  }, [floorId, floors]);

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
    setOrderSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          hallManagerEmail: currentUser.email,
          floorId,
          tableId,
          kitchenId,
          items: selectedFoods.map((item) => ({
            foodName: item.name,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to place order.");
      } else {
        setOrderSuccess(true);
        setTimeout(
          () => navigate("/hallmanager-dashboard?tab=hall-manager-dashboard"),
          1500
        );
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("Something went wrong.");
    }
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Take Order</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label value="Select Floor" />
          <Select
            value={floorId}
            onChange={(e) => setFloorId(e.target.value)}
            required
          >
            <option value="">-- Select Floor --</option>
            {floors.map((floor) => (
              <option key={floor.floorId} value={floor.floorId}>
                {floor.floorId}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label value="Select Table" />
          <Select
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            required
          >
            <option value="">-- Select Table --</option>
            {tables.map((table) => (
              <option key={table.tableId} value={table.tableId}>
                {table.tableId}{table.isBooked === 'Yes' ? 'Booked' : ''}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label value="Select Food Category" />
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

        <div>
          <Label value="Select Kitchen ID" />
          <Select
            value={kitchenId}
            onChange={(e) => setKitchenId(e.target.value)}
            required
          >
            <option value="">-- Select Kitchen --</option>
            {kitchens.map((kId, i) => (
              <option key={i} value={kId}>
                {kId}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            disabled={loading}
            outline
            className="w-fit px-1"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-2">Placing Order...</span>
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
        {orderSuccess && (
          <Alert color="success">Order placed successfully!</Alert>
        )}
        {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
      </form>
    </div>
  );
}

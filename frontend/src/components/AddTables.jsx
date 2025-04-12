import React, { useState } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Spinner,
  Alert,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function AddTables() {
  const [hotelId, setHotelId] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [floorData, setFloorData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [numberOfKitchens, setNumberOfKitchens] = useState("");
  const navigate = useNavigate();

  const handleFloorCountChange = (e) => {
    const value = parseInt(e.target.value);
    setNumberOfFloors(value);
    const data = Array.from({ length: value }, (_, i) => ({
      numberOfTables: "",
      numberOfPremiumTables: "",
      capacity: "",
      normalCharges: "",
      premiumCharges: "",
    }));
    setFloorData(data);
  };

  const handleFloorDataChange = (index, field, value) => {
    const updated = [...floorData];
    updated[index][field] = value;
    setFloorData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/hotel/addStructure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          numberOfFloors: parseInt(numberOfFloors),
          numberOfKitchens: parseInt(numberOfKitchens),
          floorData: floorData.map((floor) => ({
            numberOfTables: parseInt(floor.numberOfTables),
            numberOfPremiumTables: parseInt(floor.numberOfPremiumTables),
            capacity: parseInt(floor.capacity),
            normalCharges: parseInt(floor.normalCharges),
            premiumCharges: parseInt(floor.premiumCharges),
          })),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to add structure.");
      } else {
        setShowSuccess(true);
        setShowModal(true);
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("Something went wrong!");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/admin-dashboard");
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add Table Structure
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <Label value="Hotel ID" />
          <TextInput
            type="text"
            placeholder="Enter Hotel ID"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            required
          />
        </div>

        <div>
          <Label value="Number of Kitchens" />
          <TextInput
            type="number"
            placeholder="e.g. 3"
            value={numberOfKitchens}
            onChange={(e) => setNumberOfKitchens(e.target.value)}
            required
            min={1}
          />
        </div>

        <div>
          <Label value="Number of Floors" />
          <TextInput
            type="number"
            placeholder="e.g. 2"
            value={numberOfFloors}
            onChange={handleFloorCountChange}
            required
            min={1}
          />
        </div>

        {floorData.map((floor, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-md border shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-2">Floor {index + 1}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label value="Number of Tables" />
                <TextInput
                  type="number"
                  value={floor.numberOfTables}
                  onChange={(e) =>
                    handleFloorDataChange(
                      index,
                      "numberOfTables",
                      e.target.value
                    )
                  }
                  required
                  min={1}
                />
              </div>

              <div>
                <Label value="Number of Premium Tables" />
                <TextInput
                  type="number"
                  value={floor.numberOfPremiumTables}
                  onChange={(e) =>
                    handleFloorDataChange(
                      index,
                      "numberOfPremiumTables",
                      e.target.value
                    )
                  }
                  required
                  min={0}
                />
              </div>

              <div>
                <Label value="Capacity Per Table" />
                <TextInput
                  type="number"
                  value={floor.capacity}
                  onChange={(e) =>
                    handleFloorDataChange(index, "capacity", e.target.value)
                  }
                  required
                  min={1}
                />
              </div>

              <div>
                <Label value="Normal Table Charges (₹)" />
                <TextInput
                  type="number"
                  value={floor.normalCharges}
                  onChange={(e) =>
                    handleFloorDataChange(
                      index,
                      "normalCharges",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div>
                <Label value="Premium Table Charges (₹)" />
                <TextInput
                  type="number"
                  value={floor.premiumCharges}
                  onChange={(e) =>
                    handleFloorDataChange(
                      index,
                      "premiumCharges",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          disabled={loading}
          outline
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-2">Submitting...</span>
            </>
          ) : (
            "Add Structure"
          )}
        </Button>

        {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
        {showSuccess && (
          <Alert color="success">Structure added successfully!</Alert>
        )}
      </form>
      <Modal show={showModal} onClose={handleClose}>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-green-600 mb-4">
            Tables added successfully!
          </h3>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={handleClose}
              className="bg-blue-500 text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

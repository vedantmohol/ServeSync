import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Modal } from "flowbite-react";

export default function ReserveTable({ hotel }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const tab = new URLSearchParams(location.search).get("tab");

  useEffect(() => {
    if (!hotel) {
      navigate("/reservetable");
    }
  }, [hotel, navigate]);

  const handleBookTable = (floorId, table) => {
    setSelectedTable({ ...table, floorId });
    setShowModal(true);
  };

  const confirmBooking = () => {
    console.log("Confirm booking:", selectedTable);
    // backend logic to reserve this table
    setShowModal(false);
  };

  if (!hotel) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-6">
        <img
          src={hotel.hotelPhoto}
          alt={hotel.hotelName}
          className="w-full md:w-[300px] h-[300px] object-cover rounded-md"
        />
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">{hotel.hotelName}</h2>
          <p className="text-lg text-gray-700 capitalize">Type: {hotel.hotelType}</p>
          <p className="text-gray-600 mt-2">📍 {hotel.hotelAddress}</p>
          <p className="text-gray-600 mt-1">📞 {hotel.phone}</p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-6 text-purple-700">
        Tables Available
      </h3>

      {hotel.floors?.length > 0 ? (
        hotel.floors.map((floor, idx) => (
          <div key={idx} className="mb-8">
            <h4 className="text-xl font-bold mb-4">Floor: {floor.floorId}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {floor.tables.map((table, i) => (
                <div
                  key={i}
                  className={`p-4 border rounded-md shadow ${
                    table.isBooked === "Yes" ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  <p className="font-semibold text-md">
                    Table ID: {table.tableId}
                  </p>
                  <p className="text-sm">Type: {table.isPremium === "Yes" ? "Premium" : "Normal"}</p>
                  <p className="text-sm">Capacity: {table.capacity}</p>
                  <p className="text-sm">Charges: ₹{table.charges}</p>
                  {table.isBooked === "Yes" ? (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-red-500 text-white rounded">
                      Booked
                    </span>
                  ) : (
                    <Button
                      size="xs"
                      color="success"
                      className="mt-2"
                      onClick={() => handleBookTable(floor.floorId, table)}
                    >
                      Book Table
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No floor/table data available.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Body>
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to book this table?
            </h3>
            {selectedTable && (
              <div className="text-sm text-gray-700 mb-4">
                Table ID: <strong>{selectedTable.tableId}</strong> <br />
                Floor ID: <strong>{selectedTable.floorId}</strong> <br />
                Charges: ₹{selectedTable.charges}
              </div>
            )}
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={confirmBooking}>
                Yes
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Go Back
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

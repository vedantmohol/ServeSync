import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function ManageTables() {
  const { currentUser } = useSelector((state) => state.user);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hotel/getHotelTables?hotelId=${currentUser?.hotelId}`);
      const data = await res.json();
      if (res.ok) {
        setHotel(data);
      } else {
        setError(data.message || "Unable to fetch table data");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "hall_manager" && currentUser.hotelId) {
      fetchTables();
    }
  }, [currentUser]);

  const handleUnbookClick = (floorId, tableId) => {
    setSelectedTable({ floorId, tableId });
    setShowModal(true);
  };

  const confirmUnbook = async () => {
    try {
      const res = await fetch("/api/order/unbookTable", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: currentUser.hotelId,
          floorId: selectedTable.floorId,
          tableId: selectedTable.tableId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          setShowModal(false);
          fetchTables(); 
          setSuccessMsg("");
          navigate("/managetables");
        }, 2000);
      } else {
        setError(data.message || "Unbooking failed");
      }
    } catch (err) {
      setError("Something went wrong during unbooking");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Manage Tables</h1>

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {successMsg && <p className="text-center text-green-600">{successMsg}</p>}

      {hotel && (
        <>
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

          {hotel.floors?.map((floor, idx) => (
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
                    <p className="font-semibold text-md">Table ID: {table.tableId}</p>
                    <p className="text-sm">Type: {table.isPremium === "Yes" ? "Premium" : "Normal"}</p>
                    <p className="text-sm">Capacity: {table.capacity}</p>
                    <p className="text-sm">Charges: ₹{table.charges}</p>
                    <p className="text-sm">📅 Date: {table.date || "N/A"}</p>
                    <p className="text-sm">⏰ Time: {table.time || "N/A"}</p>
                    <p className="text-sm">👤 Name: {table.username || "N/A"}</p>
                    <p className="text-sm">📞 Phone: {table.phone || "N/A"}</p>

                    {table.isBooked === "Yes" ? (
                      <Button
                        size="xs"
                        color="failure"
                        className="mt-2"
                        onClick={() => handleUnbookClick(floor.floorId, table.tableId)}
                      >
                        Unbook
                      </Button>
                    ) : (
                      <Button size="xs" color="gray" className="mt-2" disabled>
                        Not Booked
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Body>
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Unbook</h3>
            {selectedTable && (
              <div className="text-sm text-gray-700 mb-4">
                Are you sure you want to unbook table{" "}
                <strong>{selectedTable.tableId}</strong>?
              </div>
            )}
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmUnbook}>
                Yes
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

import React, { useState } from "react";
import {
  Button,
  Label,
  Select,
  Spinner,
  TextInput,
  Alert,
  Modal,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function AddStaff() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "chef", 
    hotelId: "",
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/hotel/addStaff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to add staff.");
      } else {
        setShowModal(true);
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/admin-home");
  };

  return (
    <div className="p-6 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Staff Member</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="username" value="Username" />
          <TextInput
            id="username"
            name="username"
            placeholder="Staff Name"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="Staff Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone" value="Phone" />
          <TextInput
            id="phone"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="hotelId" value="Hotel ID" />
          <TextInput
            id="hotelId"
            name="hotelId"
            placeholder="Hotel ID"
            value={formData.hotelId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label value="Staff Type" />
          <Select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="chef">Chef</option>
            <option value="hall_manager">Hall Manager</option>
            <option value="waiter">Waiter</option>
          </Select>
        </div>

        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Adding...</span>
            </>
          ) : (
            "Add Staff"
          )}
        </Button>
      </form>

      {errorMessage && (
        <Alert color="failure" className="mb-4">
          {errorMessage}
        </Alert>
      )}

      <Modal show={showModal} onClose={handleClose}>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-green-600 mb-4">
            Staff added successfully!
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

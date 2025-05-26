import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Button,
  Label,
  Select,
  Spinner,
  TextInput,
  Alert,
  Modal,
} from "flowbite-react";

export default function EditStaff() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    hotelId: "",
    staffID: "",
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (state?.staff) {
      setFormData({
        username: state.staff.name,
        email: state.staff.email,
        phone: state.staff.phone,
        role: state.role,
        hotelId: state.hotelId,
        staffID: state.staff.staffID, 
      });
    } else {
      setErrorMessage("No staff data found.");
    }
  }, [state]);

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
      const res = await fetch("/api/hotel/updateStaff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to update staff.");
      } else {
        setShowModal(true);
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("Something went wrong.");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/admin-home");
  };

  return (
    <div className="p-6 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Staff Member</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          id="username"
          name="username"
          placeholder="Staff Name"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="Staff Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextInput
          id="phone"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <TextInput
          id="hotelId"
          name="hotelId"
          placeholder="Hotel ID"
          value={formData.hotelId}
          onChange={handleChange}
          required
        />
        <Select name="role" value={formData.role} onChange={handleChange} required disabled>
          <option value="chef">Chef</option>
          <option value="hall_manager">Hall Manager</option>
          <option value="waiter">Waiter</option>
        </Select>

        <Button type="submit" gradientDuoTone="purpleToPink" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Updating...</span>
            </>
          ) : (
            "Update Staff"
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
            Staff updated successfully!
          </h3>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={handleClose} className="bg-blue-500 text-white">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

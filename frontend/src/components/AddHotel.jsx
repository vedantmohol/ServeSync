import { Alert, Button, Label, Select, Spinner,TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ServeSyncLogo from "../assets/ServeSyncLogo.png";
import { useDispatch } from "react-redux";
import { updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice.js";

function AddHotel() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      adminName,
      phone,
      adminEmail,
      hotelName,
      hotelType,
      hotelAddress,
      hotelPassword,
    } = formData;

    if (
      !adminName ||
      !phone ||
      !adminEmail ||
      !hotelName ||
      !hotelType ||
      !hotelAddress ||
      !hotelPassword
    ) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      dispatch(updateStart());

      const res = await fetch("/api/hotel/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminName: adminName.trim(),
          phone,
          adminEmail,
          hotelName: hotelName.trim(),
          hotelType,
          hotelAddress,
          hotelPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setLoading(false);
        return setErrorMessage(data.message);
      }

      dispatch(updateSuccess(data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      dispatch(updateFailure(error.message));
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <Link to="/" className="flex items-center">
            <img
              src={ServeSyncLogo}
              alt="ServeSync Logo"
              className="w-auto h-16 rounded-xl"
            />
          </Link>
          <p className="text-sm mt-5">
            Register your Hotel to ServeSync and start managing staff & services
            seamlessly!
          </p>
        </div>

        <div className="flex-1">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div>
              <Label value="Admin Name" />
              <TextInput
                type="text"
                placeholder="Admin Name"
                id="adminName"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Phone Number" />
              <TextInput
                type="text"
                placeholder="XXXXXXXXXX"
                id="phone"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="admin@example.com"
                id="adminEmail"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Hotel Name" />
              <TextInput
                type="text"
                placeholder="Hotel Paradise"
                id="hotelName"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Hotel Type" />
              <Select id="hotelType" onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="veg-nonveg">Veg & Non-Veg</option>
              </Select>
            </div>
            <div>
              <Label value="Hotel Address" />
              <TextInput
                type="text"
                placeholder="123 Main Street"
                id="hotelAddress"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Hotel Password" />
              <TextInput
                type="password"
                placeholder="********"
                id="hotelPassword"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Registering...</span>
                </>
              ) : (
                "Register Hotel"
              )}
            </Button>
          </form>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddHotel;

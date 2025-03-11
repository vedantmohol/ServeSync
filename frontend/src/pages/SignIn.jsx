import { Button, Label, TextInput, Spinner, Select, Alert } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    staffId: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);

        switch (data.role) {
          case "customer":
            navigate("/");
            break;
          case "chef":
            navigate("/chef-dashboard");
            break;
          case "waiter":
            navigate("/waiter-dashboard");
            break;
          case "hall_manager":
            navigate("/hall-manager-dashboard");
            break;
          case "hotel_admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/");
            break;
        }
        
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-xol md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <Link to="/" className="flex items-center">
            <img
              src="./assets/ServeSyncLogo.png"
              alt="ServeSync Logo"
              className="w-auto h-12"
            />
          </Link>
          <p className="text-sm mt-5">
            Sign-In using your phone number & password to continue ordering!
          </p>
        </div>

        <div className="flex-1">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Phone Number" />
              <TextInput
                type="text"
                placeholder="XXXXXXXXXX"
                id="phone"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
                required
              />
            </div>
            <div>
                  <Label value="Role" />
                  <Select id="role" onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="customer">Customer</option>
                    <option value="chef">Chef</option>
                    <option value="waiter">Waiter</option>
                    <option value="hall_manager">Hall Manager</option>
                    <option value="hotel_admin">Hotel Admin</option>
                  </Select>
              </div>

            {formData.role !== "customer" && formData.role && (
              <>
                <div>
                  <Label value="Staff ID" />
                  <TextInput
                    type="text"
                    placeholder="Enter Staff ID"
                    id="staffId"
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="flex gap-2 mt-5 text-sm">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign-Up
            </Link>
          </div>

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

export default SignIn;
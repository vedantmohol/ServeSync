import {
  Button,
  Label,
  TextInput,
  Spinner,
  Select,
  Alert,
} from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import ServeSyncLogo from "../assets/ServeSyncLogo.png";

function SignIn() {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    staffId: "",
    hotelId: "",
    adminEmail: "",
    role: "",
  });

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
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
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
                <option value="">Select Your Role</option>
                <option value="customer">Customer</option>
                <option value="chef">Chef</option>
                <option value="waiter">Waiter</option>
                <option value="hall_manager">Hall Manager</option>
                <option value="hotel_admin">Hotel Admin</option>
              </Select>
            </div>

            { formData.role !== "hotel_admin" &&
              formData.role && (
                <>
                  <div>
                    <Label value="Email" />
                    <TextInput
                      type="email"
                      placeholder="Enter Your Email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

            {formData.role !== "customer" &&
              formData.role !== "hotel_admin" &&
              formData.role && (
                <>
                  <div>
                    <Label value="Staff ID" />
                    <TextInput
                      type="text"
                      placeholder="Enter Staff ID"
                      id="staffId"
                      value={formData.staffId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

            {formData.role === "hotel_admin" && formData.role && (
              <>
              <div>
              <Label value="Admin Email" />
              <TextInput
                type="email"
                placeholder="abc@xyz.com"
                id="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                required
              />
              </div>
              <div>
              <Label value="Hotel ID" />
              <TextInput
                type="text"
                placeholder="Eg: 12345678AB"
                id="hotelId"
                value={formData.hotelId}
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
            <OAuth />
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

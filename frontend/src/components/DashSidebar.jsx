import { Modal, Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight, HiUserAdd } from "react-icons/hi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdFastfood, MdTableBar } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice.js";
import { toast } from "react-toastify";

function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/customer/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleVerifyPassword = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/customer/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: currentUser.phone, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.message || "Incorect Password!");
      } else {
        toast.success("Password verified successfully!");
        setShowModal(false);
        setPassword("");
        if (actionType === "add-hotel") {
          setTab("add-hotel");
          navigate("/dashboard?tab=add-hotel");
        } else if (actionType === "add-staff") {
          setTab("add-staff");
          navigate("/dashboard?tab=add-staff");
        }else if (actionType === "add-tables") {
          setTab("add-tables");
          navigate("/dashboard?tab=add-tables");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error("error verifying password!");
    }
  };

  return (
    <>
      <Sidebar className="md:w-56 w-full">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.role === "hotel_admin" ? "Admin" : "User"}
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>

            {currentUser?.role === "hotel_admin" && (
              <>
                <Link to="/dashboard?tab=admin-dashboard">
                  <Sidebar.Item
                    active={tab === "admin-dashboard"}
                    icon={RiAdminFill}
                    labelColor="dark"
                    as="div"
                  >
                    Admin Dashboard
                  </Sidebar.Item>
                </Link>

                <Sidebar.Item
                  active={tab === "add-staff"}
                  icon={HiUserAdd}
                  className="cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setPassword("");
                    setActionType("add-staff");
                    setTab("add-staff");
                  }}
                >
                  Add Staff
                </Sidebar.Item>

                <Sidebar.Item
                  active={tab === "add-tables"}
                  icon={MdTableBar}
                  className="cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setPassword("");
                    setActionType("add-tables");
                    setTab("add-tables");
                  }}
                >
                  Add Tables
                </Sidebar.Item>

                <Link to="/dashboard?tab=add-food">
                  <Sidebar.Item
                    active={tab === "add-food"}
                    icon={MdFastfood}
                    labelColor="dark"
                    as="div"
                  >
                    Add Food
                  </Sidebar.Item>
                </Link>
              </>
            )}
            {currentUser?.role === "customer" && (
              <Sidebar.Item
                active={tab === "add-hotel"}
                icon={HiBuildingOffice2}
                className="cursor-pointer"
                onClick={() => {
                  setActionType("add-hotel");
                  setShowModal(true);
                  setPassword("");
                }}
              >
                Add Hotel
              </Sidebar.Item>
            )}
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              SignOut
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Enter Password
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
          />
          <div className="flex justify-end mt-4 space-x-2">
            <button
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-700"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              No
            </button>
            <button
              className={`px-4 py-2 text-white rounded-lg ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
              }`}
              onClick={handleVerifyPassword}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Yes"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DashSidebar;

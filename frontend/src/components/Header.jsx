import { useDispatch } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { FaLeaf, FaDrumstickBite } from "react-icons/fa";
import React, { useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import ServeSyncLogo from "../assets/ServeSyncLogo.png";
import { useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice.js";

function Header() {
  const [vegMode, setVegMode] = useState(true);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const path = useLocation().pathname;

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

  return (
    <Navbar className="bg-purple-800 text-white border-b-2 flex flex-wrap justify-between items-center p-4">
      <Link to="/" className="flex items-center">
        <img
          src={ServeSyncLogo}
          alt="ServeSync Logo"
          className="w-auto h-12 rounded-xl"
        />
      </Link>

      <form className="hidden lg:flex flex-1 justify-center px-4">
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="w-full max-w-md"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch className="text-xl" />
      </Button>

      <div className="flex items-center gap-2 md:order-2">
        {currentUser && currentUser.role === "customer" && (
          <Button
            gradientDuoTone="purpleToBlue"
            className="px-3 py-2"
            onClick={() => setVegMode(!vegMode)}
          >
            {vegMode ? (
              <FaLeaf className="text-green-500" />
            ) : (
              <FaDrumstickBite className="text-red-500" />
            )}
          </Button>
        )}

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        {currentUser && currentUser.role === "customer" && (
          <>
            <Navbar.Link as="div" active={path === "/reservetable"}>
              <Link to="/reservetable">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                  Book Table
                </span>
              </Link>
            </Navbar.Link>
            <Navbar.Link as="div" active={path === "/restaurants"}>
              <Link to="/restaurants">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                  Restaurants
                </span>
              </Link>
            </Navbar.Link>
            <Navbar.Link as="div" active={path === "/paybill"}>
              <Link to="/paybill">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                  Pay Bill
                </span>
              </Link>
            </Navbar.Link>
          </>
        )}

        {currentUser && currentUser.role === "hall_manager" && (
          <>
            <Navbar.Link as="div" active={path === "/vieworders"}>
              <Link to="/vieworders">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                  View Orders
                </span>
              </Link>
            </Navbar.Link>
            <Navbar.Link as="div" active={path === "/managetables"}>
              <Link to="/managetables">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                  Manage Tables
                </span>
              </Link>
            </Navbar.Link>
          </>
        )}

        {currentUser && currentUser.role === "hotel_admin" && (
          <>
            <Navbar.Link as="div" active={path === "/viewbills"}>
              <Link to="/viewbills">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                  View Bills
                </span>
              </Link>
            </Navbar.Link>
            <Navbar.Link as="div" active={path === "/updatefood"}>
              <Link to="/updatefood">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                  View Dishes
                </span>
              </Link>
            </Navbar.Link>
          </>
        )}

        {currentUser && currentUser.role === "chef" && (
          <>
            <Navbar.Link as="div" active={path === "/foodstsock"}>
              <Link to="/foodstock">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                  Food Stock
                </span>
              </Link>
            </Navbar.Link>
            <Navbar.Link as="div" active={path === "/waiters"}>
              <Link to="/waiters">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                  Call Waiters
                </span>{" "}
              </Link>
            </Navbar.Link>
          </>
        )}

        {currentUser && currentUser.role === "waiter" && (
          <Navbar.Link as="div" active={path === "/updatestatus"}>
            <Link to="/updatestatus">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:opacity-90 text-white">
                Update Status
              </span>
            </Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

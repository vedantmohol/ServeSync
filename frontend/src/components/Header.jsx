import { AiOutlineSearch } from "react-icons/ai";
import { FaLeaf, FaDrumstickBite } from "react-icons/fa";
import React, { useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import ServeSyncLogo from "../assets/ServeSyncLogo.png";
import { useSelector } from "react-redux";

function Header() {
  const [vegMode, setVegMode] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

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

      <div className="flex items-center gap-4">
        {currentUser && (
          <>
            {currentUser.role === "customer" && (
              <>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="px-4 py-2"
                  onClick={() => setVegMode(!vegMode)}
                >
                  {vegMode ? (
                    <FaLeaf className="text-green-500" />
                  ) : (
                    <FaDrumstickBite className="text-red-500" />
                  )}
                </Button>
                <Link to={"/book-table"}>
                  <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                    Book Table
                  </Button>
                </Link>
                <Link to="/bill">
                  <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                    Pay Bill
                  </Button>
                </Link>
              </>
            )}

            {currentUser.role === "hall_manager" && (
              <>
                <Link to={"/take-order"}>
                  <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                    Take Orders
                  </Button>
                </Link>
                <Link to={"/generate-bill"}>
                  <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                    Generate Bills
                  </Button>
                </Link>
                <Link to={"/manage-table"}>
                  <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                    Manage Tables
                  </Button>
                </Link>
              </>
            )}

            {currentUser.role === "hotel_admin" && (
              <>
                <Link to={"/admin-bills"}>
                  <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                    View Bill
                  </Button>
                </Link>
                <Link to={"/staff"}>
                  <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                    View Staff
                  </Button>
                </Link>
              </>
            )}

            {currentUser.role === "chef" && (
              <>
                <Link to={"/orders-chef"}>
                  <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                    View Orders
                  </Button>
                </Link>
                <Link to={"/food-stock"}>
                  <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                    Food Stock
                  </Button>
                </Link>
              </>
            )}

            {currentUser.role === "waiter" && (
              <Link to="/mark-availability">
                <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
                  Mark Availability
                </Button>
              </Link>
            )}
          </>
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
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </Navbar>
  );
}

export default Header;

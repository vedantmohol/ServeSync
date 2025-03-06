import { AiOutlineSearch } from "react-icons/ai";
import { FaLeaf, FaDrumstickBite } from "react-icons/fa";
import React, { useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

function Header() {
  const [vegMode, setVegMode] = useState(true);
  const currentUser = null;

  return (
    <Navbar className="bg-purple-800 text-white border-b-2 flex flex-wrap justify-between items-center p-4">
      <Link to="/" className="flex items-center">
        <img
          src="./assets/ServeSyncLogo.png"
          alt="ServeSync Logo"
          className="w-auto h-12"
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
        )}

        {currentUser && (
          <Link to="/bills">
            <Button gradientDuoTone="purpleToBlue" className="px-4 py-2">
              Bill
            </Button>
          </Link>
        )}

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/profile">
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

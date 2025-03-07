import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-4">
        {/* LeftSide */}
        <div className="flex-1">
          <Link to="/" className="flex items-center">
            <img
              src="./assets/ServeSyncLogo.png"
              alt="ServeSync Logo"
              className="w-auto h-12"
            />
          </Link>
          <p className="text-sm mt-5">
            Sign-Up using your phone number & password and grab your favourite food now!
          </p>
        </div>

        {/* RightSide */}
        <div className="flex-1">
          <form className="flex flex-col gap-3">
            <div>
              <Label value="Your Username"/>
              <TextInput type="text" placeholder="Username" id="username"/>
            </div>
            <div>
              <Label value="Your Phone Number"/>
              <TextInput type="text" placeholder="XXXXXXXXXX" id="number"/>
            </div>
            <div>
              <Label value="Your Email"/>
              <TextInput type="text" placeholder="name@example.com" id="email"/>
            </div>
            <div>
              <Label value="Password"/>
              <TextInput type="password" placeholder="********" id="password"/>
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">Sign-Up</Button>
          </form>
          <div className="flex gap-2 mt-5 text-sm">
            <span>Already Have an account?</span>
            <Link to={'/sign-in'} className="text-blue-500">Sign-In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
} from "react-icons/bs";

function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-purple-600 bg-white">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white">
                Serve
              </span>
              Sync
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="SERVESYNC" />
              <Footer.LinkGroup col>
                <Footer.Link href="/restaurants">Browse Restaurants</Footer.Link>
                <Footer.Link href="/reservetable">Reserve a Table</Footer.Link>
                <Footer.Link href="/cart">Pay Bill</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="CONNECT" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://github.com/vedantmohol" target="_blank" rel="noopener noreferrer">
                  GitHub
                </Footer.Link>
                <Footer.Link href="https://x.com/vedant_1314" target="_blank" rel="noopener noreferrer">
                  Twitter
                </Footer.Link>
                <Footer.Link href="https://www.linkedin.com/in/vedant-mohol-a79613271" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="LEGAL" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider />

        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="/"
            by="ServeSync™"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon
              href="https://www.instagram.com/vedant.1314"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsInstagram}
            />
            <Footer.Icon
              href="https://x.com/vedant_1314"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsTwitter}
            />
            <Footer.Icon
              href="https://github.com/vedantmohol"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsGithub}
            />
            <Footer.Icon
              href="https://www.linkedin.com/in/vedant-mohol-a79613271"
              target="_blank"
              rel="noopener noreferrer"
              icon={BsLinkedin}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterCom;

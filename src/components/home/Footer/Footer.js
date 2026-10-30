import React from "react";
import { Link } from "react-router-dom";
import Image from "../../designLayouts/Image";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import {
  logo,
  instagram,   
  facebook ,
  bg    
} from "../../../assets/images";

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          imgSrc={bg}
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full px-8 py-8">

        {/* TOP LINE */}
        <hr className="border-t-2 border-[#884B2C] w-full" />

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* LOGO */}
          <div className="w-48">
            <Image
              imgSrc={logo}
              className="w-full object-contain"
            />
          </div>

          {/* CONTACT INFO */}
          <div
            className="text-center"
            style={{
              fontFamily: "'Syne', sans-serif",
              color: "#884B2C",
            }}
          >
            <p className="text-lg font-semibold">Contact</p>

  <p className="text-sm flex items-center justify-center gap-2">
    <FaPhoneAlt className="text-[#884B2C]" />
    +216 95 715 400
  </p>

  <p className="text-sm flex items-center justify-center gap-2">
    <FaMapMarkerAlt className="text-[#884B2C]" />
    Moknine, Tunisia
  </p>
</div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/roma.terra.ceramics/"
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-70 transition"
            >
              <Image
                imgSrc={instagram}
                className="w-10 h-10 object-contain"
              />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100083099422111&locale=fr_FR"
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-70 transition"
            >
              <Image
                imgSrc={facebook}
                className="w-10 h-10 object-contain"
              />
            </a>
          </div>

        </div>

        {/* COPYRIGHT */}
        <p
          className="text-xl text-center mt-6"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: "#884B2C",
          }}
        >
          © 2025 RomaTerra.tn All rights reserved
        </p>
        <p
          className="text-sm text-center mt-2"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <Link to="/privacy" className="text-[#884B2C] underline hover:opacity-70">
            Privacy Policy
          </Link>
        </p>

      </div>
    </footer>
  );
};

export default Footer;
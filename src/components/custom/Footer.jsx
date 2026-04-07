import React from "react";
import { Link } from "react-router-dom";
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillMail,
  AiFillTwitterCircle,
} from "react-icons/ai";

function Footer({ footerRef }) {
  const socialIcons = [
    {
      name: "GitHub",
      icon: <AiFillGithub size={24} />,
      link: "https://github.com/satendra03",
    },
    {
      name: "Linkedin",
      icon: <AiFillLinkedin size={24} />,
      link: "https://linkedin.com/in/connect-satendra",
    },
    {
      name: "Instagram",
      icon: <AiFillInstagram size={24} />,
      link: "https://instagram.com/_satendra_03",
    },
    {
      name: "Mail",
      icon: <AiFillMail size={24} />,
      link: "mailto:satendrakumarparteti.work@gmail.com",
    },
    {
      name: "Twitter",
      icon: <AiFillTwitterCircle size={24} />,
      link: "https://twitter.com/satendra_03",
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="w-full bg-secondary/30 border-t py-12 mt-10"
    >
      <div className="container max-w-[1024px] mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Safar Logo" className="h-10 w-10 md:h-12 md:w-12 drop-shadow-md" />
            <span className="text-3xl md:text-4xl font-black bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
              Safar
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mt-2 pr-4 md:pr-0">
            Your premium AI-powered trip planner. We help you design your ultimate dream vacation with professional, localized itineraries mapping the best routes around the globe!
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3 md:items-center">
          <h4 className="text-xl font-bold tracking-tight text-primary/90">Quick Links</h4>
          <ul className="flex flex-col gap-3 mt-2">
            <li>
              <Link to="/plan-a-trip" className="text-muted-foreground hover:text-blue-500 transition-colors font-medium">
                Plan a Trip
              </Link>
            </li>
            <li>
              <Link to="/all-trips" className="text-muted-foreground hover:text-blue-500 transition-colors font-medium">
                My Trips
              </Link>
            </li>
            <li>
              <Link to="/" className="text-muted-foreground hover:text-blue-500 transition-colors font-medium">
                Home Page
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials & Legal */}
        <div className="flex flex-col gap-3 md:items-end md:text-right">
          <h4 className="text-xl font-bold tracking-tight text-primary/90">Connect</h4>
          <div className="flex items-center gap-5 mt-2">
            {socialIcons.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue-500 transition-all transform hover:-translate-y-1 hover:drop-shadow-md duration-300"
                aria-label={item.name}
              >
                {item.icon}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <p className="text-muted-foreground text-sm font-medium">
              Safar &copy; {new Date().getFullYear()}
            </p>
            <p className="text-muted-foreground text-sm opacity-80">
              Designed by Anurag | All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

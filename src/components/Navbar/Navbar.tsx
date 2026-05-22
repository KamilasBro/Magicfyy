import "./navbar.scss";
import LogoSvg from "../../assets/images/logo/navbarLogo.svg?react"
import HamburgerSvg from "../../assets/images/icons/hamburger.svg?react";

import MobileNavbar from "./MobileNavbar";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/utils/other/useIsMobile";
import { navLinksList } from "@/utils/other/navLinksList";


const Navbar: React.FC = () => {
  const isMobile = useIsMobile()
  const [showMobileNavbar, setShowMobileNavbar] = useState(false)
  const [isNavbarOnTop, setIsNavbarOnTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarOnTop(window.scrollY === 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`${isNavbarOnTop ? "" : "scrolled"} navbar w-screen flex items-center justify-center fixed z-10`}
      >
        <div className="inner-nav flex items-center justify-between">
          {isMobile &&
            <HamburgerSvg
              className="hamburger"
              onClick={() => setShowMobileNavbar(true)}
            />}
          {!isMobile &&
            <>
              <Link to={"/"}>
                <LogoSvg className="logo" />
              </Link>
              <ul className="nav-links flex ">
                {navLinksList.map((navLink) =>
                  <li key={navLink.name} className="nav-link">
                    <Link to={navLink.link}>
                      {navLink.name}
                    </Link>
                  </li>
                )}
              </ul>
            </>}
        </div>
      </nav>
      {isMobile && showMobileNavbar &&
        <MobileNavbar
          showMobileNavbar={showMobileNavbar}
          setShowMobileNavbar={setShowMobileNavbar}
        />}
    </>
  );
};

export default Navbar;

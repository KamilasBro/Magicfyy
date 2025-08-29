import { useState } from "react";
import LogoSvg from "../../assets/images/logo/navbarLogo.svg?react"
import { Link } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import HamburgerSvg from "../../assets/images/icons/hamburger.svg?react";
import "./navbar.scss";
const Navbar: React.FC = () => {
  const [Ypos, setYPos] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  window.onresize = () => {
    if (window.innerWidth > 1024) {
      setIsMobile(false);
    }
  };
  window.onscroll = () => {
    if (window.innerWidth <= 1024) return;
    if (window.scrollY === 0) {
      setYPos(true);
    } else {
      setYPos(false);
    }
  };


  if (isMobile) {
    (document.querySelector("html") as HTMLElement).style.overflowY = "hidden";
  } else {
    (document.querySelector("html") as HTMLElement).style.overflowY = "visible";
  }
  return (
    <>
      <nav
        className={`${Ypos ? "" : "scrolled"} navbar w-screen flex items-center justify-center fixed z-10`}
      >
        <div className="inner-nav flex items-center justify-between">
          <HamburgerSvg className="hamburger" onClick={() => setIsMobile(!isMobile)} />
          <Link to={"/"}>
            <LogoSvg className="logo" />
          </Link>
          <ul className="nav-links flex ">
            <li className="nav-link">
              <Link to={"/"}>Search</Link>
            </li>
            <li className="nav-link">
              <Link to={"/advanced"}>Advanced Search</Link>
            </li>
            <li className="nav-link">
              <Link to={"/sets"}>Sets</Link>
            </li>
            <li className="nav-link">
              <Link to={"/guess"}>Guess The Card</Link>
            </li>
          </ul>

        </div>
      </nav>
      {isMobile && <MobileNavbar isMobile={isMobile} setIsMobile={setIsMobile} />}

    </>

  );
};

export default Navbar;

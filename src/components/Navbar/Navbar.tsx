import { useState } from "react";
import LogoSvg from "../../assets/images/logo/logo.svg?react"
import { Link } from "react-router-dom";
import "./navbar.scss";
const Navbar: React.FC = () => {
  const [Ypos, setYPos] = useState(true);

  window.onscroll = () => {
    if (window.scrollY === 0) {
      setYPos(true);
    } else {
      setYPos(false);
    }
  };
  return (
    <nav
      className="navbar w-screen flex items-center justify-center fixed z-10"
      style={
        Ypos === true ? { background: "transparent" } : { background: "black" }
      }
    >
      <div className="inner-nav flex items-center justify-between">
        <Link to={"/"}>
          <LogoSvg/>
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
  );
};

export default Navbar;

import React, { useRef } from "react";
import LogoSvg from "../../assets/images/logo/mobileLogo.svg?react"
import CloseSvg from "../../assets/images/icons/close.svg?react";
import { Link } from "react-router-dom";
import "./navbar.scss";

interface MobileNavbarProps {
    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ setIsMobile }) => {
    const navRef = useRef<HTMLElement>(null);
    const handleClose = () => {
        if (navRef.current) {
            navRef.current.style.animationName = "slideOut";
            setTimeout(() => {
                navRef.current!.style.animationName = "slideIn";
                setIsMobile(false);
            }, 200);//matching the 250 like in css causes the navbar to flash or a milisecond
        }
    };
    return (
        <nav ref={navRef} className="MobileNavbar flex flex-col fixed z-20">
            <CloseSvg className="close-icon" onClick={handleClose} />
            <Link to={"/"} >
                <LogoSvg className="mobile-logo" onClick={handleClose} />
            </Link>
            <ul className="nav-links flex ">
                <li className="nav-link" >
                    <Link onClick={handleClose} to={"/"}>Search</Link>
                </li>
                <li className="nav-link">
                    <Link onClick={handleClose} to={"/advanced"}>Advanced Search</Link>
                </li>
                <li className="nav-link">
                    <Link onClick={handleClose} to={"/sets"}>Sets</Link>
                </li>
                <li className="nav-link">
                    <Link onClick={handleClose} to={"/guess"}>Guess The Card</Link>
                </li>
            </ul>
        </nav>

    );
};

export default MobileNavbar;

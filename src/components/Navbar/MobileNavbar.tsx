import React, { useEffect, useRef } from "react";
import LogoSvg from "../../assets/images/logo/mobileLogo.svg?react"
import CloseSvg from "../../assets/images/icons/close.svg?react";
import { Link } from "react-router-dom";
import "./navbar.scss";

interface MobileNavbarProps {
    isMobile: boolean;
    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ isMobile, setIsMobile }) => {
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
    //append class to prevent trigger clicking event outside MobileNavbar
    useEffect(() => {
        const main = document.querySelector("main");
        if (isMobile) {
            main?.classList.add("menu-open");
        } else {
            main?.classList.remove("menu-open");
        }
        return () => main?.classList.remove("menu-open");
    }, [isMobile]);
    //prevent switching between clickables outside of MobileNavbar
    useEffect(() => {
        if (!isMobile) return;

        const focusableEls = navRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button, input, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls?.[0];
        const lastEl = focusableEls?.[focusableEls.length - 1];

        function handleKey(e: KeyboardEvent) {
            if (e.key === "Tab") {
                if (document.activeElement === lastEl && !e.shiftKey) {
                    e.preventDefault();
                    firstEl?.focus();
                } else if (document.activeElement === firstEl && e.shiftKey) {
                    e.preventDefault();
                    lastEl?.focus();
                }
            }
            if (e.key === "Escape") {
                handleClose();
            }
        }

        document.addEventListener("keydown", handleKey);
        firstEl?.focus();

        return () => document.removeEventListener("keydown", handleKey);
    }, [isMobile]);


    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                handleClose();
            }
        }

        if (isMobile) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobile]);
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

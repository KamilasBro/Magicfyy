import LogoSvg from "../../assets/images/logo/mobileLogo.svg?react";
import CloseSvg from "../../assets/images/icons/close.svg?react";

import React, { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { navLinksList } from "@/utils/other/navLinksList";

const MobileNavbar: React.FC<{
    showMobileNavbar: boolean;
    setShowMobileNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showMobileNavbar, setShowMobileNavbar }) => {
    const navRef = useRef<HTMLElement>(null);

    const handleClose = useCallback(() => {
        const nav = navRef.current;
        if (!nav) return;

        nav.style.animationName = "slideOut";

        nav.addEventListener(
            "animationend",
            () => {
                nav.style.animationName = "slideIn";
                setShowMobileNavbar(false);
            },
            { once: true }
        );
    }, [setShowMobileNavbar]);

    //disable scroll at mount
    useEffect(() => {
        const html = document.documentElement;
        const main = document.querySelector("main");

        html.style.overflowY = showMobileNavbar ? "hidden" : "visible";
        main?.classList.toggle("menu-open", showMobileNavbar);

        return () => {
            html.style.overflowY = "visible";
            main?.classList.remove("menu-open");
        };
    }, [showMobileNavbar]);

    //disable interactions on rest of site on mount
    useEffect(() => {
        if (!showMobileNavbar) return;

        const getFocusables = () =>
            navRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button, input, [tabindex]:not([tabindex="-1"])'
            );

        const handleKeyDown = (e: KeyboardEvent) => {
            const focusables = getFocusables();
            if (!focusables?.length) return;

            const firstEl = focusables[0];
            const lastEl = focusables[focusables.length - 1];

            if (e.key === "Tab") {
                if (e.shiftKey && document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                } else if (!e.shiftKey && document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }

            if (e.key === "Escape") {
                handleClose();
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleMouseDown);

        getFocusables()?.[0]?.focus();

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, [showMobileNavbar, handleClose]);

    return (
        <nav ref={navRef} className="MobileNavbar flex flex-col fixed z-20">
            <div className="logo-wrap">
                <Link to="/" onClick={handleClose}>
                    <LogoSvg className="mobile-logo" />
                </Link>
                <CloseSvg className="close-icon" onClick={handleClose} />
            </div>

            <ul className="nav-links flex">
                {navLinksList.map((navLink) => (
                    <li
                        key={`mobile ${navLink.name}`}
                        className="nav-link"
                        onClick={handleClose}
                    >
                        <Link to={navLink.link}>{navLink.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default MobileNavbar;
import { useEffect, useState } from "react";
import { useIsMobile } from "@/utils/other/useIsMobile";

export const useScrollForDropDown = () => {
    const isMobile = useIsMobile();
    const [scrollTick, setScrollTick] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!isMobile) {
                setScrollTick((tick) => tick + 1);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isMobile]);

    return scrollTick;
};
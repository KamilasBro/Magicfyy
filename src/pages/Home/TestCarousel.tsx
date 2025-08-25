import React, { useRef, useEffect, useState } from "react";
import "./home.scss";

const items = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];

const TestCarousel: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollSpeed = 1; // możesz dostosować
        let animationFrameId: number;

        const animate = () => {
            if (!container || isHovered) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            container.scrollLeft += scrollSpeed;

            const totalScroll = container.scrollWidth / 2;
            if (container.scrollLeft >= totalScroll) {
                container.scrollLeft -= totalScroll;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered]);

    return (
        <div
            className="carousel"
            ref={containerRef}
            onMouseEnter={() => {
                if (window.innerWidth >= 1024) setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
        >
            {[...items, ...items].map((e: number, index: number) => (
                <div key={index}>{e}</div>
            ))}
        </div>
    );
};

export default TestCarousel;

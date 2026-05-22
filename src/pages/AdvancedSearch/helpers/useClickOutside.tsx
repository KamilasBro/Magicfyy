import { useEffect } from "react";

export const useClickOutside= (
  refs: React.RefObject<HTMLElement>[],
  handler: () => void
) => {
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const isInsideAny = refs.some(
        (ref) =>
          ref.current && ref.current.contains(event.target as Node)
      );

      if (!isInsideAny) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [refs, handler]);
};
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//on path change we scroll website to top

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

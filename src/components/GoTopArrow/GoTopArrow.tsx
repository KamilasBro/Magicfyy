import "./goTopArrow.scss";

import Arrow1Svg from "../../assets/images/icons/arrow1.svg?react";
import Arrow2Svg from "../../assets/images/icons/arrow2.svg?react";

import React, { useState } from "react";

const GoTopArrow: React.FC = () => {
  const [show, setShow] = useState(false);
  window.onscroll = () => {
    setShow(false);
  }

  return (
    <div
      className={`go-top-box fixed z-10 ${show && "show-box"}`}
      onMouseEnter={() => {
        setShow(true);
      }}
      onMouseLeave={() => {
        setShow(false);
      }}
    >
      <Arrow2Svg
        className="hide-show-arrow absolute"
        onClick={(event) => {
          event.stopPropagation();
          setShow((prevState) => !prevState);
        }}
      />
      <div className="flex flex-col items-center">
        <Arrow1Svg
          className="go-top-arrow"
          onClick={() => {
            setShow(false);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
        Scroll Top
      </div>
    </div>
  );
};
export default GoTopArrow;

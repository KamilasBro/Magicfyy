import "./loadingCardsAnim.scss";

import LoadingCardSvg from "../../assets/images/loadingCard/loadingCard.svg?react";

const LoadingCardsAnim: React.FC = () => {
  return (
    <div className="Loading-cards flex justify-center items-center">
      <div className="Loading-cards-wrap flex justify-center items-center">
        {Array(3).fill(null).map((_, index) => (
          <span className="Loading-cards-svg" key={`loading-${index}`}>
            <LoadingCardSvg />
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingCardsAnim;

import "./loadingCardsAnim.scss";
import LoadingCardSvg from "../../assets/images/loadingCard/loadingCard.svg?react";
const LoadingCardsAnim: React.FC = () => {
  return (
    <section className="Loading-cards flex justify-center items-center">
      <div className="Loading-cards-wrap flex justify-center items-center">
        <span className="Loading-cards-svg">
          <LoadingCardSvg />
        </span>
        <span className="Loading-cards-svg">
          <LoadingCardSvg />
        </span>
        <span className="Loading-cards-svg">
          <LoadingCardSvg />
        </span>
      </div>
    </section>
  );
};

export default LoadingCardsAnim;

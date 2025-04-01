import QuestionMarkSvg from "../../assets/images/icons/questionMark.svg?react";
import { Link } from "react-router-dom";
import "./notFound.scss";

const NotFound: React.FC = () => {
  return (
    <section className="Not-found flex justify-center items-center">
      <QuestionMarkSvg />
      <div>
        <h1>Not Found</h1>
        <Link to={"/"}>
          <button>Go to search page</button>
        </Link>
      </div>
    </section>
  );
};

export default NotFound;

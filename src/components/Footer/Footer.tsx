import LogoSvg from "../../assets/images/logo/footerLogo.svg?react";
import { Link } from "react-router-dom";
import "./footer.scss";
const Footer: React.FC = () => {
  return (
    <footer className="footer flex items-center justify-center">
      <div className="inner-footer flex items-center justify-between">
        <Link to={"/"}>
          <LogoSvg className="logo"/>
        </Link>
        <p>
          All names and trademarks used on this website belong to their
          respective owners. This site is for informational purposes only and is
          not affiliated with or endorsed by official products or publishers
          associated with Magic: The Gathering. All card images, texts, and
          other content are the property of their respective creators.
          <br />
          <br />
          This site utilizes the API provided by Scryfall{" "}
          <a className="footer-link" href="https://scryfall.com/docs/api">
            https://scryfall.com/docs/api
          </a>
        </p>
        <ul className="nav-links flex flex-col">
          <li className="nav-link">
            <Link to={"/"}>Search</Link>
          </li>
          <li className="nav-link">
            <Link to={"/advanced"}>Advanced Search</Link>
          </li>
          <li className="nav-link">
            <Link to={"/sets"}>Sets</Link>
          </li>
          <li className="nav-link">
            <Link to={"/guess"}>Guess The Card</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

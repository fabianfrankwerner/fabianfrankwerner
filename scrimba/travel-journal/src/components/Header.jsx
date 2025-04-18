import "../index.css";
import globe from "../assets/globe.svg";

export default function Header() {
  return (
    <header>
      <img className="header--img" src={globe} alt="" />
      <h1 className="header--h1">my travel journal.</h1>
    </header>
  );
}

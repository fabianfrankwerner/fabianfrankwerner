import "../index.css";
import email from "../assets/email.svg";
import linkedin from "../assets/linkedin.svg";
import hero from "../assets/hero.png";

export default function Info() {
  return (
    <header>
      <img src={hero} alt="Laura Smith" />
      <h1>Laura Smith</h1>
      <h2>Frontend Developer</h2>
      <h3>laurasmith.website</h3>
      <div className="header--buttons">
        <button className="header--button-email">
          <img src={email} className="button-icon" alt="" />
          Email
        </button>
        <button className="header--button-linkedin">
          <img src={linkedin} className="button-icon" alt="" />
          LinkedIn
        </button>
      </div>
    </header>
  );
}

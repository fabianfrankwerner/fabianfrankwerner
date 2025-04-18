import "../index.css";
import twitter from "../assets/twitter.svg";
import facebook from "../assets/facebook.svg";
import instagram from "../assets/instagram.svg";
import github from "../assets/github.svg";

export default function Footer() {
  return (
    <footer>
      <img src={twitter} alt="Twitter" />
      <img src={facebook} alt="Facebook" />
      <img src={instagram} alt="Instagram" />
      <img src={github} alt="Github" />
    </footer>
  );
}

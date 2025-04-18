import success from "../../assets/success.svg";
import warning from "../../assets/warning.svg";
import error from "../../assets/error.svg";
import neutral from "../../assets/neutral.svg";

export default function Banner({ children }) {
  return (
    <div className="banner">
      <img className="icon" src={success} alt="" />
      <div className="banner--text">
        <p className="banner--heading">Congratulations!</p>
        <p className="banner--body">{children}</p>
      </div>
    </div>
  );
}

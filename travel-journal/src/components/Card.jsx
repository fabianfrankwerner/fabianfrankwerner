import "../index.css";
import pin from "../assets/pin.svg";

export default function Card({
  isLast,
  imageUrl,
  location,
  googleMapsUrl,
  title,
  startDate,
  endDate,
  description,
}) {
  return (
    <>
      <div className="card">
        <div className="card--left">
          <img className="card--left-img" src={imageUrl} alt="" />
        </div>
        <div className="card--right">
          <div className="card--right--top">
            <img className="card--right--top-img" src={pin} alt="" />
            <h3 className="card--right--top-h3">{location}</h3>
            <p className="card--right--top-p">
              <a href={googleMapsUrl}>View on Google Maps</a>
            </p>
          </div>
          <h2 className="card--right-h2">{title}</h2>
          <h4 className="card--right-h4">
            {startDate} - {endDate}
          </h4>
          <p className="card--right-p">{description}</p>
        </div>
      </div>
      {!isLast && <hr />}
    </>
  );
}

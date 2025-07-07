import "./App.css";
import { useState } from "react";
import Information from "./components/Information";
import Education from "./components/Education";
import Occupation from "./components/Occupation";

export default function App() {
  const [data, setData] = useState({
    information: { name: "", email: "", phone: "" },
    education: { school: "", study: "", startDate: "", endDate: "" },
    occupation: {
      company: "",
      position: "",
      responsibility: "",
      startDate: "",
      endDate: "",
    },
  });

  return (
    <div className="app-container">
      <div className="form-section">
        <Information
          information={data.information}
          onUpdateInformation={setData}
        />
        <Education education={data.education} onUpdateEducation={setData} />
        <Occupation occupation={data.occupation} onUpdateOccupation={setData} />
      </div>
      <div className="cv-preview">
        <h2>Curriculum Vitae</h2>
        <section>
          <h3>Personal Information</h3>
          <p>
            <strong>Name:</strong> {data.information.name}
          </p>
          <p>
            <strong>Email:</strong> {data.information.email}
          </p>
          <p>
            <strong>Phone:</strong> {data.information.phone}
          </p>
        </section>
        <section>
          <h3>Education</h3>
          <p>
            <strong>School:</strong> {data.education.school}
          </p>
          <p>
            <strong>Field of Study:</strong> {data.education.study}
          </p>
          <p>
            <strong>Start Date:</strong> {data.education.startDate}
          </p>
          <p>
            <strong>End Date:</strong> {data.education.endDate}
          </p>
        </section>
        <section>
          <h3>Occupation</h3>
          <p>
            <strong>Company:</strong> {data.occupation.company}
          </p>
          <p>
            <strong>Position:</strong> {data.occupation.position}
          </p>
          <p>
            <strong>Responsibility:</strong> {data.occupation.responsibility}
          </p>
          <p>
            <strong>Start Date:</strong> {data.occupation.startDate}
          </p>
          <p>
            <strong>End Date:</strong> {data.occupation.endDate}
          </p>
        </section>
      </div>
    </div>
  );
}

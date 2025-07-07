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
    <>
      <Information
        information={data.information}
        onUpdateInformation={setData}
      />
      <Education education={data.education} onUpdateEducation={setData} />
      <Occupation occupation={data.occupation} onUpdateOccupation={setData} />

      <p>{data.occupation.company}</p>
      <p>{data.occupation.position}</p>
      <p>{data.occupation.responsibility}</p>
      <p>{data.occupation.startDate}</p>
      <p>{data.occupation.endDate}</p>
    </>
  );
}

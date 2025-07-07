import "../styles/education.css";

export default function Education({ education, onUpdateEducation }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onUpdateEducation((prevData) => ({
      ...prevData,
      education: {
        ...prevData.education,
        [name]: value,
      },
    }));
  }

  return (
    <>
      <h1>Education</h1>
      <div>
        <label htmlFor="school">
          School
          <input
            type="text"
            name="school"
            value={education.school}
            onChange={handleChange}
            placeholder="School"
          />
        </label>
        <label htmlFor="study">
          Study
          <input
            type="text"
            name="study"
            value={education.study}
            onChange={handleChange}
            placeholder="Study"
          />
        </label>
        <label htmlFor="startDate">
          Start Date
          <input
            type="date"
            name="startDate"
            value={education.startDate}
            onChange={handleChange}
            placeholder="Start Date"
          />
        </label>
        <label htmlFor="endDate">
          End Date
          <input
            type="date"
            name="endDate"
            value={education.endDate}
            onChange={handleChange}
            placeholder="End Date"
          />
        </label>
      </div>
      <hr />
    </>
  );
}

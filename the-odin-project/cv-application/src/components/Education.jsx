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
    <div className="education-section">
      <h1>Education</h1>
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
        Field of Study
        <input
          type="text"
          name="study"
          value={education.study}
          onChange={handleChange}
          placeholder="Field of Study"
        />
      </label>
      <label htmlFor="startDate">
        Start Date
        <input
          type="text"
          name="startDate"
          value={education.startDate}
          onChange={handleChange}
          placeholder="Start Date"
        />
      </label>
      <label htmlFor="endDate">
        End Date
        <input
          type="text"
          name="endDate"
          value={education.endDate}
          onChange={handleChange}
          placeholder="End Date"
        />
      </label>
    </div>
  );
}

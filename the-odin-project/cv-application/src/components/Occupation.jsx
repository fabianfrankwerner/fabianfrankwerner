import "../styles/occupation.css";

export default function Occupation({ occupation, onUpdateOccupation }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onUpdateOccupation((prevData) => ({
      ...prevData,
      occupation: {
        ...prevData.occupation,
        [name]: value,
      },
    }));
  }

  return (
    <>
      <h1>Occupation</h1>
      <div>
        <label htmlFor="company">
          Company
          <input
            type="text"
            name="company"
            value={occupation.company}
            onChange={handleChange}
            placeholder="Company"
          />
        </label>
        <label htmlFor="position">
          Position
          <input
            type="text"
            name="position"
            value={occupation.position}
            onChange={handleChange}
            placeholder="Position"
          />
        </label>
        <label htmlFor="responsibility">
          Responsibility
          <input
            type="text"
            name="responsibility"
            value={occupation.responsibility}
            onChange={handleChange}
            placeholder="Responsibility"
          />
        </label>
        <label htmlFor="startDate">
          Start Date
          <input
            type="date"
            name="startDate"
            value={occupation.startDate}
            onChange={handleChange}
            placeholder="Start Date"
          />
        </label>
        <label htmlFor="endDate">
          End Date
          <input
            type="date"
            name="endDate"
            value={occupation.endDate}
            onChange={handleChange}
            placeholder="End Date"
          />
        </label>
      </div>
      <hr />
    </>
  );
}

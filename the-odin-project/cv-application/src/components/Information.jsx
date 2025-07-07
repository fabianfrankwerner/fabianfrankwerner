import "../styles/information.css";

export default function Information({ information, onUpdateInformation }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onUpdateInformation((prevData) => ({
      ...prevData,
      information: {
        ...prevData.information,
        [name]: value,
      },
    }));
  }

  return (
    <>
      <h1>Information</h1>
      <div>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            value={information.name}
            onChange={handleChange}
            placeholder="Name"
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            value={information.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </label>
        <label htmlFor="phone">
          Phone
          <input
            type="tel"
            name="phone"
            value={information.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
        </label>
      </div>
    </>
  );
}

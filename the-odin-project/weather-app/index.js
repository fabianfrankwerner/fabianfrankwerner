async function getWeather(city) {
  console.log(city);
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=WBDEY9T6TGDQ4HWGSMPT9THAZ&contentType=json`,
      {
        mode: "cors",
      }
    );
    const data = await response.json();
    return data.days[0];
  } catch (error) {
    console.error(error);
  }
}

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = e.target.city.value;
  const weather = await getWeather(city);
  console.log(weather);
  e.target.reset();
});

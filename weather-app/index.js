async function getWeather(city) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=WBDEY9T6TGDQ4HWGSMPT9THAZ&contentType=json`,
      {
        mode: "cors",
      }
    );
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    return data.days[0];
  } catch (error) {
    throw error;
  }
}

function showLoading() {
  const weatherDiv = document.getElementById("weather");
  weatherDiv.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Loading weather data...</p>
    </div>
  `;
}

function showError(message) {
  const weatherDiv = document.getElementById("weather");
  weatherDiv.innerHTML = `
    <div class="error">
      <p>Error: ${message}</p>
    </div>
  `;
}

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = e.target.city.value;

  if (!city.trim()) {
    showError("Please enter a city name");
    return;
  }

  showLoading();

  try {
    const weather = await getWeather(city);
    const weatherDiv = document.getElementById("weather");
    weatherDiv.innerHTML = `
      <h2>Weather in ${city.toUpperCase()}</h2>
      <p>Temperature: ${weather.temp}°C</p>
      <p>Description: ${weather.description}</p>
      <p>Humidity: ${weather.humidity}%</p>
      <p>Wind: ${weather.windspeed} km/h</p>
      <p>Pressure: ${weather.pressure} hPa</p>
      <p>Visibility: ${weather.visibility} km</p>
      <p>UV Index: ${weather.uvindex}</p>
      <p>Sunrise: ${weather.sunrise}</p>
      <p>Sunset: ${weather.sunset}</p>
    `;
  } catch (error) {
    showError(error.message);
  }

  e.target.reset();
});

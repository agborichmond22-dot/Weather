const API_KEY = "cda28365192897b0cc050d5fa7f9017f";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Grab elements once so we don't keep querying the DOM
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const messageEl = document.getElementById("message");
const resultEl = document.getElementById("weatherResult");

const cityNameEl = document.getElementById("cityName");
const weatherIconEl = document.getElementById("weatherIcon");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");
const feelsLikeEl = document.getElementById("feelsLike");

// Default condition on initial load
document.body.dataset.condition = "clear-day";

function updateTheme(data) {
  if (!data || !data.weather || !data.weather[0]) {
    document.body.dataset.condition = "clear-day";
    return;
  }

  const main = data.weather[0].main;
  const icon = data.weather[0].icon || "";
  const isNight = icon.endsWith("n");

  let condition = "clear-day";

  if (main === "Thunderstorm") {
    condition = "stormy";
  } else if (main === "Rain" || main === "Drizzle") {
    condition = "rainy";
  } else if (main === "Snow") {
    condition = "snowy";
  } else if (main === "Clouds" || main === "Mist" || main === "Fog" || main === "Haze" || main === "Smoke" || main === "Dust" || main === "Sand" || main === "Ash" || main === "Squall" || main === "Tornado") {
    condition = "cloudy";
  } else if (main === "Clear") {
    condition = isNight ? "night" : "clear-day";
  } else if (isNight) {
    condition = "night";
  }

  document.body.dataset.condition = condition;
}

async function getWeather(city) {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    showMessage("Loading...");
    resultEl.classList.add("hidden");

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Check the spelling and try again.");
      }
      if (response.status === 401) {
        throw new Error("Invalid API key. Double-check it, or wait for it to activate.");
      }
      throw new Error("Something went wrong. Please try again.");
    }

    const data = await response.json();
    displayWeather(data);
    showMessage("");
  } catch (error) {
    showMessage(error.message);
  }
}

function displayWeather(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionEl.textContent = data.weather[0].description;
  humidityEl.textContent = `${data.main.humidity}%`;
  windSpeedEl.textContent = `${data.wind.speed} m/s`;
  feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;

  const iconCode = data.weather[0].icon;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconEl.alt = data.weather[0].description;

  updateTheme(data);

  resultEl.classList.remove("hidden");
}

function showMessage(text) {
  messageEl.textContent = text;
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    showMessage("Please enter a city name.");
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

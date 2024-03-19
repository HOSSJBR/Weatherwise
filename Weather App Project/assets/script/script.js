const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const daysForecastDiv = document.querySelector(".days-forecast");
const citiesList = document.querySelector("#cities-list");
const showdiv = document.querySelector(".showdiv");
const API_KEY = "Enter your api key";

// Create weather card HTML based on weather data
const createWeatherCard = (cityName, weatherItem, index) => {
  console.log(weatherItem);

  const datastr = `${weatherItem.dt_txt.split(" ")[0]}`;
  const data = new Date(datastr);
  const daysofweek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayofweek = daysofweek[data.getDay()];

  return ` <div class="cardContainer">
    <div class="card">
    <p class="city">${dayofweek}</p>
                            <img class="weather_img" src="../assets/images/${
                              weatherItem.weather[0].icon
                            }.webp" alt="weather icon">
                            <p class="temp">${Math.round(
                              weatherItem.main.temp - 273.15
                            )}°C</p>

                        </div>
                    </div>
                </div>`;
};

// Create weather card HTML based on weather data
const createachday = (forecastArray) => {
  let html = `<div class="flex_weatherforecast">`;

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDate = null;

  forecastArray.forEach((weatherItem) => {
    document.querySelector(".showdiv").innerHTML = "";
    const date = new Date(weatherItem.dt_txt.split(" ")[0]);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const time = weatherItem.dt_txt.split(" ")[1].slice(0, -3); // Extract time from date string

    if (currentDate !== date.getDate()) {
      if (currentDate !== null) {
        html += `</div></div>`; // Close previous day's columns
      }

      html += `
          <div class="col_${dayOfWeek.toLowerCase()}">
            <h2 class="smallheading${
              currentDate === null ? "" : " sticky"
            }">${dayOfWeek}</h2>
            <div class="weathercolumns">
        `;
    }

    html += `
        <div class="today_timedata">
          <p>${time}</p>
          <img src="../assets/images/${
            weatherItem.weather[0].icon
          }.webp" alt="" />
          ${Math.round(weatherItem.main.temp - 273.15)}°C
        </div>
      `;

    currentDate = date.getDate();
  });

  html += `</div></div></div>`;
  return html;
};

// Get weather details of passed latitude and longitude
const getWeatherDetails = (cityName, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  currentWeatherDiv.innerHTML = "";
  showdiv.innerHTML = "";
  fetch(WEATHER_API_URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const forecastArray = data.list;

      const html2 = createachday(forecastArray);
      currentWeatherDiv.innerHTML = "";
      currentWeatherDiv.insertAdjacentHTML("beforeend", html2);

      showdiv.insertAdjacentHTML("beforeend", html2);

      const uniqueForecastDays = new Set();

      const fiveDaysForecast = forecastArray.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (
          !uniqueForecastDays.has(forecastDate) &&
          uniqueForecastDays.size < 7
        ) {
          uniqueForecastDays.add(forecastDate);
          return true;
        }
        return false;
      });

      console.log(fiveDaysForecast);

      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      daysForecastDiv.innerHTML = "";

      fiveDaysForecast.forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, weatherItem, index);
        daysForecastDiv.insertAdjacentHTML("beforeend", html);
      });
    })
    .catch(() => {
      alert("An error occurred while fetching the weather forecast!");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (cityName === "") {
    displayEnterCountryMessage();
    return;
  }
  const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occurred while fetching the coordinates!");
    });
};

searchButton.addEventListener("click", () => getCityCoordinates());

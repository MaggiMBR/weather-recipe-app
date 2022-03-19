const apiKey = "f28fa454c198fbfeaef6e3f85f051b68"; // API Key is here for simplicity, but should not be inside the code, it should be stored as an Environmental Variable
const apiBaseUrl = "https://api.openweathermap.org/data/2.5";

// Current position
function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const units = "metric";
  const apiUrl = `${apiBaseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
  axios.get(apiUrl).then(showCity);
}
navigator.geolocation.getCurrentPosition(showPosition);

// Current weather

function showTemperature(response) {
  // Temperature
  const actualTemperature = Math.round(response.data.main.temp);
  const h4 = document.querySelector("h4");
  h4.innerHTML = ` ${actualTemperature}°`;

  // Feels like
  const feelsLike = Math.round(response.data.main.feels_like);
  const feels = document.querySelector("#feels-like");
  feels.innerHTML = `${feelsLike}°`;

  // Wind
  const actualWind = Math.round(response.data.wind.speed);
  const wind = document.querySelector("#wind");
  wind.innerHTML = `${actualWind}km/h`;

  //Humidity
  const actualHumidity = Math.round(response.data.main.humidity);
  const humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${actualHumidity}%`;

  // Max degree
  const actualMaxDg = Math.round(response.data.main.temp_max);
  const maxDg = document.querySelector("#actual-max-dg");
  maxDg.innerHTML = `${actualMaxDg}°/`;

  // Min degree
  const actualMinDg = Math.round(response.data.main.temp_min);
  const minDg = document.querySelector("#actual-min-dg");
  minDg.innerHTML = `${actualMinDg}°`;

  // Weather description
  const weatherType = response.data.weather[0].description;
  const weather = document.querySelector("#weather-type");
  weather.innerHTML = weatherType;
}

// Current city-country
function showCity(response) {
  const city = response.data.name;
  const country = response.data.sys.country;

  const cityCountry = document.querySelector("h2");
  cityCountry.innerHTML = `${city} - ${country}`;
}

// Search  button
function handleSubmit(event) {
  event.preventDefault();
  const city = document.querySelector("#form-text").value;
  search(city);
}
const formCity = document.querySelector("#city-form");
formCity.addEventListener("submit", handleSubmit);

// Default city
function search(city) {
  const units = "metric";
  const apiUrl = `${apiBaseUrl}/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}

// Weather by city

function displayWeather(response) {
  // city-country name
  const city = response.data.name;
  const country = response.data.sys.country;

  const cityCountry = document.querySelector("h2");
  cityCountry.innerHTML = `${city} - ${country}`;

  // Temperature
  celsiusTemperature = response.data.main.temp;

  const actualTemperature = Math.round(celsiusTemperature);
  const h4 = document.querySelector("h4");
  h4.innerHTML = ` ${actualTemperature}°`;

  // Feels like
  const feelsLike = Math.round(response.data.main.feels_like);
  const feels = document.querySelector("#feels-like");
  feels.innerHTML = `${feelsLike}°`;

  // Wind
  const actualWind = Math.round(response.data.wind.speed);
  const wind = document.querySelector("#wind");
  wind.innerHTML = `${actualWind}km/h`;

  //Humidity
  const actualHumidity = Math.round(response.data.main.humidity);
  const humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${actualHumidity}%`;

  // Max degree
  const actualMaxDg = Math.round(response.data.main.temp_max);
  const maxDg = document.querySelector("#actual-max-dg");
  maxDg.innerHTML = `${actualMaxDg}°/`;

  // Min degree
  const actualMinDg = Math.round(response.data.main.temp_min);
  const minDg = document.querySelector("#actual-min-dg");
  minDg.innerHTML = `${actualMinDg}°`;

  // Weather description
  const weatherType = response.data.weather[0].description;
  const weather = document.querySelector("#weather-type");
  weather.innerHTML = weatherType;

  // Date info
  const h3 = document.querySelector("h3");
  //const actualTime = document.querySelector("#actual-time");
  h3.innerHTML = formatDate(response.data.dt * 1000);

  // Link to city coodinates
  getForcast(response.data.coord);
}

// Current Date

function formatDate(timestamp) {
  const now = new Date(timestamp);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[now.getDay()];
  const currentDate = now.getDate();

  //Current hour
  let currentHour = now.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  //Current minutes
  let currentMinutes = now.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  //last update - time
  const actualTime = document.querySelector("#last-update-time");
  actualTime.innerHTML = `Last update at ${currentHour}:${currentMinutes}`;

  return `Day | ${currentDay}, ${currentDate}`;
}

// City coordinates
function getForcast(coordinates) {
  const units = "metric";
  const apiUrl = `${apiBaseUrl}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeatherDay);
}

// Date city weather
function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN.", "MON.", "TUE.", "WED.", "THU.", "FRI.", "SAT."];
  return days[day];
}

// City Weather per day
function displayWeatherDay(response) {
  const dayInfoWeather = response.data.daily;

  const dayElement = document.querySelector("#weatherDay");

  let dayHTML = `<div class="row box-day-degree">`;

  dayInfoWeather.forEach(function (dayInfo, index) {
    if (index < 6) {
      dayHTML =
        dayHTML +
        ` <div class="col-2 info-day">
        <div class="weather-day-date">${formatDay(dayInfo.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            dayInfo.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-day-temperatures">
          <span class="weather-day-temp-max"> ${Math.round(
            dayInfo.temp.max
          )}°/ </span>
          <span class="weather-day-temp-min"> ${Math.round(
            dayInfo.temp.min
          )}° </span>
        </div>
        </div>`;
    }
  });
  dayHTML = dayHTML + `</div>`;
  dayElement.innerHTML = dayHTML;
}

const celsiusTemperature = null;

search("Quito");

// Coder API key 
const apiKey = "f28fa454c198fbfeaef6e3f85f051b68";

// Open weather 
const apiBaseUrl = "https://api.openweathermap.org/data/2.5";

// Current position
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let units = "metric";
  let apiUrl = `${apiBaseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
  axios.get(apiUrl).then(showCity);
}
navigator.geolocation.getCurrentPosition(showPosition);

// Current weather

function showTemperature(response) {
  // Temperature
  let actualTemperature = Math.round(response.data.main.temp);
  let h4 = document.querySelector("h4");
  h4.innerHTML = ` ${actualTemperature}°`;

  // Feels like
  let feelsLike = Math.round(response.data.main.feels_like);
  let feels = document.querySelector("#feels-like");
  feels.innerHTML = `${feelsLike}°`;

  // Wind
  let actualWind = Math.round(response.data.wind.speed);
  let wind = document.querySelector("#wind");
  wind.innerHTML = `${actualWind}km/h`;

  //Humidity
  let actualHumidity = Math.round(response.data.main.humidity);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${actualHumidity}%`;

  // Max degree
  let actualMaxDg = Math.round(response.data.main.temp_max);
  let maxDg = document.querySelector("#actual-max-dg");
  maxDg.innerHTML = `${actualMaxDg}°/`;

  // Min degree
  let actualMinDg = Math.round(response.data.main.temp_min);
  let minDg = document.querySelector("#actual-min-dg");
  minDg.innerHTML = `${actualMinDg}°`;

  // Weather description
  let weatherType = response.data.weather[0].description;
  let weather = document.querySelector("#weather-type");
  weather.innerHTML = weatherType;
}

// Current city-country
function showCity(response) {
  let city = response.data.name;
  let country = response.data.sys.country;

  let cityCountry = document.querySelector("h2");
  cityCountry.innerHTML = `${city} - ${country}`;
}

// Search  button
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#form-text").value;
  search(city);
}
let formCity = document.querySelector("#city-form");
formCity.addEventListener("submit", handleSubmit);

// Default city
function search(city) {
  let units = "metric";
  let apiUrl = `${apiBaseUrl}/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}

// Weather by city

function displayWeather(response) {
  // city-country name
  let city = response.data.name;
  let country = response.data.sys.country;

  let cityCountry = document.querySelector("h2");
  cityCountry.innerHTML = `${city} - ${country}`;

  // Temperature
  celsiusTemperature = response.data.main.temp;

  let actualTemperature = Math.round(celsiusTemperature);
  let h4 = document.querySelector("h4");
  h4.innerHTML = ` ${actualTemperature}°`;

  // Feels like
  let feelsLike = Math.round(response.data.main.feels_like);
  let feels = document.querySelector("#feels-like");
  feels.innerHTML = `${feelsLike}°`;

  // Wind
  let actualWind = Math.round(response.data.wind.speed);
  let wind = document.querySelector("#wind");
  wind.innerHTML = `${actualWind}km/h`;

  //Humidity
  let actualHumidity = Math.round(response.data.main.humidity);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${actualHumidity}%`;

  // Max degree
  let actualMaxDg = Math.round(response.data.main.temp_max);
  let maxDg = document.querySelector("#actual-max-dg");
  maxDg.innerHTML = `${actualMaxDg}°/`;

  // Min degree
  let actualMinDg = Math.round(response.data.main.temp_min);
  let minDg = document.querySelector("#actual-min-dg");
  minDg.innerHTML = `${actualMinDg}°`;

  // Weather description
  let weatherType = response.data.weather[0].description;
  let weather = document.querySelector("#weather-type");
  weather.innerHTML = weatherType;

  // Date info
  let h3 = document.querySelector("h3");
  h3.innerHTML = formatDate(response.data.dt * 1000);

  // Link to city coodinates
  getForcast(response.data.coord);
}

// Current Date

function formatDate(timestamp) {
  let now = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let curruentDay = days[now.getDay()];
  let currentDate = now.getDate();

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
  let actualTime = document.querySelector("#last-update-time");
  actualTime.innerHTML = `Last update at ${currentHour}:${currentMinutes}`;

  return `Day | ${curruentDay}, ${currentDate}`;
}

// City coordinates
function getForcast(coordinates) {
  let units = "metric";
  let apiUrl = `${apiBaseUrl}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayWeatherDay);
}

// Date city weather
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["SUN.", "MON.", "TUE.", "WED.", "THU.", "FRI.", "SAT."];
  return days[day];
}

// City Weather per day
function displayWeatherDay(response) {
  let dayInfoWeather = response.data.daily;

  let dayElement = document.querySelector("#weatherDay");

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

let celsiusTemperature = null;

search("Quito");

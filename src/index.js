let now = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = days[now.getDay()];

let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}

let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

let date = document.querySelector(".currentDate");
date.innerHTML = `${day} ${hours}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col day">
      <div class="weather-forecast-date">
        <strong>${formatDay(forecastDay.dt)}</strong>
      </div>
      <img src="https://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" 
      alt="" 
      width="42"
      />
      <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max">
          <strong>${Math.round(forecastDay.temp.max)}°</strong>
        </span>
        
        <span class="weather-forecast-temperature-min">${Math.round(
          forecastDay.temp.min
        )}°</span>
      </div>
    </div>
  
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "9c55ea90da683c1de40704337e5e7c02";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let city = response.data.name;
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = `${city}`;
  let temperature = Math.round(response.data.main.temp);
  let tempElement = document.querySelector(".temperature");
  tempElement.innerHTML = `${temperature}`;
  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector(".precipitation");
  humidityElement.innerHTML = `Humidity: ${humidity}%`;
  let wind = Math.round(response.data.wind.speed * 3.6);
  let windElement = document.querySelector(".wind");
  windElement.innerHTML = `Wind: ${wind} km/h`;
  let weather = response.data.weather[0].main;
  let weatherElement = document.querySelector(".weather");
  weatherElement.innerHTML = `${weather}`;
  let emoji = response.data.weather[0].icon;
  let emojiElement = document.querySelector(".weather-emoji");
  emojiElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${emoji}@2x.png">`;

  getForecast(response.data.coord);

  let bodyElement = document.querySelector("body");
  let timeElement = new Date().getHours();

  bodyElement.classList.remove(
    "background-clearsky-day",
    "background-clearsky-night",
    "background-clouds",
    "background-drizzle",
    "background-fog",
    "background-rain",
    "background-snowfall",
    "background-thunderstorm"
  );

  if (
    weatherElement.innerHTML === "Clear" &&
    timeElement > 5 &&
    timeElement < 20
  ) {
    bodyElement.classList.replace("background-clearsky-day");
  }

  if (
    weatherElement.innerHTML === "Clear" &&
    (timeElement < 6 || timeElement > 19)
  ) {
    bodyElement.classList.add("background-clearsky-night");
  }

  if (weatherElement.innerHTML === "Clouds") {
    bodyElement.classList.add("background-clouds");
  }

  if (weatherElement.innerHTML === "Drizzle") {
    bodyElement.classList.add("background-drizzle");
  }

  if (weatherElement.innerHTML === "Fog") {
    bodyElement.classList.add("background-fog");
  }

  if (weatherElement.innerHTML === "Rain") {
    bodyElement.classList.add("background-rain");
  }

  if (weatherElement.innerHTML === "Snow") {
    bodyElement.classList.replace("background-snowfall");
  }

  if (weatherElement.innerHTML === "Thunderstorm") {
    bodyElement.classList.replace("background-thunderstorm");
  }
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  showCityTemperature(searchInput.value);
}

let form = document.querySelector(".search-form");
form.addEventListener("submit", search);

function showCityTemperature(cityName) {
  let apiKey = "9c55ea90da683c1de40704337e5e7c02";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

showCityTemperature("Vienna");

function convertFahrenheit(event) {
  event.preventDefault();
  if (fahrenheitLink.classList.contains("link-inactive")) {
    return;
  }
  temperature.innerHTML = Math.round(temperature.innerHTML * 1.8 + 32);
  fahrenheitLink.classList.add("link-inactive");
  celsiusLink.classList.remove("link-inactive");
  fahrenheitLink.removeEventListener("click", convertFahrenheit);
  celsiusLink.addEventListener("click", convertCelsius);
}

let fahrenheitLink = document.querySelector(".fahrenheit-link");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let temperature = document.querySelector(".temperature");

function convertCelsius(event) {
  event.preventDefault();
  if (celsiusLink.classList.contains("link-inactive")) {
    return;
  }
  temperature.innerHTML = Math.round(((temperature.innerHTML - 32) * 5) / 9);
  celsiusLink.classList.add("link-inactive");
  fahrenheitLink.classList.remove("link-inactive");
  celsiusLink.removeEventListener("click", convertCelsius);
  fahrenheitLink.addEventListener("click", convertFahrenheit);
}

let celsiusLink = document.querySelector(".celsius-link");
celsiusLink.addEventListener("click", convertCelsius);

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "9c55ea90da683c1de40704337e5e7c02";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}`;
  axios.get(`${apiUrl}&units=metric&appid=${apiKey}`).then(showTemperature);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let locationButton = document.querySelector(".current-location");
locationButton.addEventListener("click", getLocation);

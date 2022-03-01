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

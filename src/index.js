locatePosition();
let date = document.querySelector("#date");
let currentDateAndTime = new Date();
let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let currentWeekDay = weekDays[currentDateAndTime.getDay()];
date.innerHTML = `${currentWeekDay} ${currentDateAndTime.getHours()}:${currentDateAndTime.getMinutes()}`;

let city = document.querySelector("#city");
let currentTemp = document.querySelector("#temperature");
let weatherDescription = document.querySelector("#weather-description");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");

let apiKey = "819d2830a6cec8ee668b535af2021283";
let apiURL = "https://api.openweathermap.org/data/2.5/weather?";

let form = document.querySelector("#search-form");
form.addEventListener("submit", changeCity);
function changeCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let cityValue = cityInput.value;
  if (cityValue) {
    city.innerHTML = cityValue;
    axios
      .get(`${apiURL}q=${cityValue}&units=metric&appid=${apiKey}`)
      .then(changeInfo);
  } else {
    alert("Input the city");
  }
}

function changeInfo(response) {
  city.innerHTML = response.data.name;
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  weatherDescription.innerHTML = response.data.weather[0].main;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  wind.innerHTML = `Wind: ${response.data.wind.speed} m/s`;
}

let buttonCurrent = document.querySelector("#current-location-button");
buttonCurrent.addEventListener("click", locatePosition);
function locatePosition() {
  navigator.geolocation.getCurrentPosition(showTemp);
  function showTemp(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    axios
      .get(`${apiURL}lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`)
      .then(changeInfo);
  }
}

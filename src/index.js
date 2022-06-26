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
let weatherIcon = document.querySelector(".weather-icon");
let weatherIconCode;
let weatherIconSrc;


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
  currentTemp.innerHTML = `${Math.round(response.data.main.temp)}`;
  weatherDescription.innerHTML = response.data.weather[0].main;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  wind.innerHTML = `Wind: ${response.data.wind.speed} m/s`;
  weatherIconCode = response.data.weather[0].icon;
  weatherIconSrc = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`
  weatherIcon.setAttribute("src", `${weatherIconSrc}`);
  getForecast(response.data.coord);
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

function displayForecast(response){
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  let forecast = response.data.daily;
  forecast.forEach(function (forecastDay, index){
    if(index<6){
      forecastHTML = forecastHTML + `
            <div class="col-2">
              <div class="weather-forecast-date">
                ${formatDay(forecastDay.dt)}
              </div>
              <img src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="forecast icon for today" height="50px">
              <div class="weather-forecast-temp">
                <span class="weather-forecast-temp-max">${Math.round(forecastDay.temp.max)}°</span>
                <span class="weather-forecast-temp-min">${Math.round(forecastDay.temp.min)}°</span>
              </div>
            </div>`;
    }

  })
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates){
  console.log(coordinates);
  let currentLat = coordinates.lat;
  let currentLong = coordinates.lon;
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentLat}&lon=${currentLong}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
  axios.get(forecastApiUrl).then(displayForecast);
}

function formatDay(timestamp){
  let date = new Date(timestamp*1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
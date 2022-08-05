"use script";
let ICON_URL = ``;

const search = document.querySelector(".weather-app__search");
const form = document.querySelector(".weather-app__form");
const weatherIcon = document.querySelector(".weather-info__icon");
const weatherAppCity = document.querySelector(".weather-info__city");
const mainDate = document.querySelector(".main__date");
const mainHours = document.querySelector('.main__date-hours')

const weatherAppDescription = document.querySelector(
  ".weather-info__description"
);
let weather = {};
let foo = {}



function getWeather(city = localStorage.getItem("city")) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?appid=0bbbc7d0f2ead1064e133292c30ba495&lang=&units=metric&q=${city}&lang=ru`
  ).then((data) => {
    localStorage.setItem("city", city);
    return data.json();
  });
}

async function getData(event) {
  event.preventDefault();
  weather = await getWeather(search.value);
  const { name: city } = weather;
  const { icon, description, main } = weather.weather[0];
  const{temp} = weather.main;

  ICON_URL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  insertData(city, description,temp);
}

function insertData(city, description,temp) {
    console.log(temp)
  weatherAppCity.textContent = city;
  weatherIcon.innerHTML = `<img src="${ICON_URL}">`;
  weatherAppDescription.innerHTML = `<p class="weather-info__description-item">${description}</p> <p class="weather-info__description-item weather-info__description-item-temp">${temp} C</p>`;
  mainDate.innerHTML = `<li>${new Date().getFullYear()}</li><li>${getDate().month[new Date().getMonth()]}</li><li>${getDate().days[new Date().getDay()]}</li>`
  mainHours.innerHTML = `<li>${new Date().getHours()}:</li><li>${new Date().getMinutes()}:</li><li>${new Date().getSeconds()}</li>`;
}

function getDate() {
    const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const days = ['Mon','Tues','Wedn','Thurs','Fri','Sat','Sun']
    return{
        month,
        days
    }
}
console.log()

form.addEventListener("submit", getData);




if (localStorage.getItem("city")) {
  let weather = {};
  async function start() {
    weather = await getWeather();
    const { name: city } = weather;
    const { icon, description, main } = weather.weather[0];
    const{temp} = weather.main;
    ICON_URL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    insertData(city, description,temp);
  }
  start();
}

"use script";

let ICON_URL = ``;

const search = document.querySelector(".weather-app__search");
const form = document.querySelector(".weather-app__form");
const weatherIcon = document.querySelector(".weather-info__icon");
const weatherAppCity = document.querySelector(".weather-info__city");
const mainDate = document.querySelector(".main__date");
const mainHours = document.querySelector(".main__date-hours");
const weatherhourly = document.querySelector(".weather-hourly");
const weatherDaily = document.querySelector(".weather-daily");

const weatherAppDescription = document.querySelector(
  ".weather-info__description"
);

function delay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1);
  });
}

if (localStorage.getItem('city')) {
  search.value = localStorage.getItem('city')
}


function getWeather(city = localStorage.getItem("city")) {
  return delay()
    .then(() => {
      return fetch(
        `https://ru.api.openweathermap.org/data/2.5/weather?appid=0bbbc7d0f2ead1064e133292c30ba495&lang=ru&q=${city}&units=metric`
      );
    })
    .then((data) => {
      localStorage.setItem("city", city);
      return data.json();
    });
}

function getHourlyWeather(
  lon = localStorage.getItem("lon"),
  lat = localStorage.getItem("lat")
) {
  return fetch(
    `https://ru.api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=0bbbc7d0f2ead1064e133292c30ba495&lang=ru&units=metric`
  )
    .then((data) => {
      localStorage.setItem("lat", lat);
      localStorage.setItem("lon", lon);
      return data.json();
    })
    .then((data) => {
      return data;
    });
}

let weather = {};
let hourlyWeather = {};

async function getData(event) {
  event.preventDefault();

  try {
    document.querySelector(".weather-info").style.display = "block";
    document.querySelector(".error-block").style.display = "none";

    weather = await getWeather(search.value.trim());
   

    const { name: city } = weather;
    const { lon, lat } = weather.coord; //coord for other fetch

    hourlyWeather = await getHourlyWeather(lon, lat); //fetch hourly weather
    const { icon, description, main } = weather.weather[0];
    const { temp } = weather.main;

    const { hourly, daily } = hourlyWeather;
    ICON_URL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    insertData(city, description, temp);
    insertHourlyData(hourly);
    insertDailyData(daily);
  } catch (error) {
    console.log(error)
    document.querySelector(".error-block").style.display = "block";
    document.querySelector(
      ".error-block"
    ).innerHTML = `<h1>incorrect city</h1>`;
    document.querySelector(".weather-info").style.display = "none";
  }
}

function insertData(city, description, temp) {
  weatherAppCity.textContent = city;
  weatherIcon.innerHTML = `<img src="${ICON_URL}">`;
  weatherAppDescription.innerHTML = `<p class="weather-info__description-item">${description}</p> <p class="weather-info__description-item weather-info__description-item-temp">${Math.floor(
    temp
  )} C</p>`;
  mainDate.innerHTML = `<li>${new Date().getFullYear()}</li><li>${
    getDate().month[new Date().getMonth()]
  }</li><li>${getDate().days[new Date().getDay()]}</li>`;

  function time() {
    let sec = new Date().getSeconds();
    let min = new Date().getMinutes();
    let hours = new Date().getHours();
    if (sec < 10) {
      sec = "0" + new Date().getSeconds();
    }

    if (min < 10) {
      min = "0" + new Date().getMinutes();
    }
    if (hours == "0") {
      hours = "0" + new Date().getHours();
    }
    mainHours.innerHTML = `<li>${hours}:</li><li>${min}</li>:<li>${sec}</li>`;
  }
  setInterval(time, 1000);
}

function insertHourlyData(hourly) {
  const hourlyItem = [hourly[0], hourly[2], hourly[4], hourly[6], hourly[8]];
  const weatherItem = weatherhourly.children;

  const temp = {
    temp1: Math.floor(hourlyItem[0].temp),
    temp2: Math.floor(hourlyItem[1].temp),
    temp3: Math.floor(hourlyItem[2].temp),
    temp4: Math.floor(hourlyItem[3].temp),
    temp5: Math.floor(hourlyItem[4].temp),
  };

  const icons = {
    icon1: hourlyItem[0].weather[0].icon,
    icon2: hourlyItem[1].weather[0].icon,
    icon3: hourlyItem[2].weather[0].icon,
    icon4: hourlyItem[3].weather[0].icon,
    icon5: hourlyItem[4].weather[0].icon,
  };

  weatherItem[0].querySelector(".weather-hourly__first-time").textContent =
    timeConverter(hourlyItem[0].dt);
  weatherItem[1].querySelector(".weather-hourly__second-time").textContent =
    timeConverter(hourlyItem[1].dt);
  weatherItem[2].querySelector(".weather-hourly__third-time").textContent =
    timeConverter(hourlyItem[2].dt);
  weatherItem[3].querySelector(".weather-hourly__fourth-time").textContent =
    timeConverter(hourlyItem[3].dt);
  weatherItem[4].querySelector(".weather-hourly__fifth-time").textContent =
    timeConverter(hourlyItem[4].dt);

  timeLen1 = document.querySelector(".weather-hourly__first-time").textContent
    .length;
  timeLen2 = document.querySelector(".weather-hourly__second-time").textContent
    .length;
  timeLen3 = document.querySelector(".weather-hourly__third-time").textContent
    .length;
  timeLen4 = document.querySelector(".weather-hourly__fourth-time").textContent
    .length;
  timeLen5 = document.querySelector(".weather-hourly__fifth-time").textContent
    .length;
  if (timeLen1 < 5) {
    document.querySelector(".weather-hourly__first-time").textContent =
      document.querySelector(".weather-hourly__first-time").textContent + 0;
  }
  if (timeLen2 < 5) {
    document.querySelector(".weather-hourly__second-time").textContent =
      document.querySelector(".weather-hourly__second-time").textContent + 0;
  }
  if (timeLen3 < 5) {
    document.querySelector(".weather-hourly__third-time").textContent =
      document.querySelector(".weather-hourly__third-time").textContent + 0;
  }
  if (timeLen4 < 5) {
    document.querySelector(".weather-hourly__fourth-time").textContent =
      document.querySelector(".weather-hourly__fourth-time").textContent + 0;
  }
  if (timeLen5 < 5) {
    document.querySelector(".weather-hourly__fifth-time").textContent =
      document.querySelector(".weather-hourly__fifth-time").textContent + 0;
  }

  weatherItem[0].querySelector(
    ".weather-hourly__first-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon1}@2x.png`}>`;
  weatherItem[1].querySelector(
    ".weather-hourly__second-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon2}@2x.png`}>`;
  weatherItem[2].querySelector(
    ".weather-hourly__third-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon3}@2x.png`}>`;
  weatherItem[3].querySelector(
    ".weather-hourly__fourth-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon4}@2x.png`}>`;
  weatherItem[4].querySelector(
    ".weather-hourly__fifth-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon5}@2x.png`}>`;

  weatherItem[0].querySelector(
    ".weather-hourly__first-temp"
  ).textContent = `${temp.temp1} C`;
  weatherItem[1].querySelector(
    ".weather-hourly__second-temp"
  ).textContent = ` ${temp.temp2} C`;
  weatherItem[2].querySelector(
    ".weather-hourly__third-temp"
  ).textContent = `${temp.temp3} C`;
  weatherItem[3].querySelector(
    ".weather-hourly__fourth-temp"
  ).textContent = `${temp.temp4} C`;
  weatherItem[4].querySelector(
    ".weather-hourly__fifth-temp"
  ).textContent = `${temp.temp5} C`;
}

function insertDailyData(daily) {
  console.log(daily);
  const dailyItem = [
    daily[0],
    daily[1],
    daily[2],
    daily[3],
    daily[4],
    daily[5],
    daily[6],
    daily[7],
  ];
  const weatherItem = weatherDaily.children;

  const temp = {
    temp1: Math.floor(dailyItem[0].temp.eve),
    temp2: Math.floor(dailyItem[1].temp.eve),
    temp3: Math.floor(dailyItem[2].temp.eve),
    temp4: Math.floor(dailyItem[3].temp.eve),
    temp5: Math.floor(dailyItem[4].temp.eve),

    temp6: Math.floor(dailyItem[5].temp.eve),
    temp7: Math.floor(dailyItem[6].temp.eve),
    temp8: Math.floor(dailyItem[7].temp.eve),
  };

  const icons = {
    icon1: dailyItem[0].weather[0].icon,
    icon2: dailyItem[1].weather[0].icon,
    icon3: dailyItem[2].weather[0].icon,
    icon4: dailyItem[3].weather[0].icon,
    icon5: dailyItem[4].weather[0].icon,

    icon6: dailyItem[5].weather[0].icon,
    icon7: dailyItem[6].weather[0].icon,
    icon8: dailyItem[7].weather[0].icon,
  };

  weatherItem[0].querySelector(".weather-daily__first-time").textContent =
    timeConverterDaily(dailyItem[0].dt);
  weatherItem[1].querySelector(".weather-daily__second-time").textContent =
    timeConverterDaily(dailyItem[1].dt);
  weatherItem[2].querySelector(".weather-daily__third-time").textContent =
    timeConverterDaily(dailyItem[2].dt);
  weatherItem[3].querySelector(".weather-daily__fourth-time").textContent =
    timeConverterDaily(dailyItem[3].dt);
  weatherItem[4].querySelector(".weather-daily__fifth-time").textContent =
    timeConverterDaily(dailyItem[4].dt);
  weatherItem[5].querySelector(".weather-daily__sixth-time").textContent =
    timeConverterDaily(dailyItem[5].dt);
  weatherItem[6].querySelector(".weather-daily__seventh-time").textContent =
    timeConverterDaily(dailyItem[6].dt);
  weatherItem[7].querySelector(".weather-daily__eighth-time").textContent =
    timeConverterDaily(dailyItem[7].dt);

  weatherItem[0].querySelector(
    ".weather-daily__first-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon1}@2x.png`}>`;
  weatherItem[1].querySelector(
    ".weather-daily__second-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon2}@2x.png`}>`;
  weatherItem[2].querySelector(
    ".weather-daily__third-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon3}@2x.png`}>`;
  weatherItem[3].querySelector(
    ".weather-daily__fourth-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon4}@2x.png`}>`;
  weatherItem[4].querySelector(
    ".weather-daily__fifth-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon5}@2x.png`}>`;
  weatherItem[5].querySelector(
    ".weather-daily__sixth-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon6}@2x.png`}>`;
  weatherItem[6].querySelector(
    ".weather-daily__seventh-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon7}@2x.png`}>`;
  weatherItem[7].querySelector(
    ".weather-daily__eighth-icon"
  ).innerHTML = `<img class="icon" src =${`http://openweathermap.org/img/wn/${icons.icon8}@2x.png`}>`; /* eighth */

  weatherItem[0].querySelector(
    ".weather-daily__first-temp"
  ).textContent = `${temp.temp1} C`;
  weatherItem[1].querySelector(
    ".weather-daily__second-temp"
  ).textContent = ` ${temp.temp2} C`;
  weatherItem[2].querySelector(
    ".weather-daily__third-temp"
  ).textContent = `${temp.temp3} C`;
  weatherItem[3].querySelector(
    ".weather-daily__fourth-temp"
  ).textContent = `${temp.temp4} C`;
  weatherItem[4].querySelector(
    ".weather-daily__fifth-temp"
  ).textContent = `${temp.temp5} C`;
  weatherItem[5].querySelector(
    ".weather-daily__sixth-temp"
  ).textContent = `${temp.temp6} C`;
  weatherItem[6].querySelector(
    ".weather-daily__seventh-temp"
  ).textContent = `${temp.temp7} C`;
  weatherItem[7].querySelector(
    ".weather-daily__eighth-temp"
  ).textContent = `${temp.temp8} C`;
}

function getDate() {
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Mon", "Tues", "Wedn", "Thurs", "Fri", "Sat", "Sun"];
  return {
    month,
    days,
  };
}

form.addEventListener("submit", getData);
document.querySelector('.weather-app__btn').addEventListener('click',getData)

if (localStorage.getItem("city")) {
  let weather = {};
  async function start() {
    weather = await getWeather();
    hourlyWeather = await getHourlyWeather();
    const { name: city } = weather;
    const { icon, description, main } = weather.weather[0];
    const { temp } = weather.main;
    const { hourly, daily } = hourlyWeather;
    ICON_URL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    insertData(city, description, temp);
    insertHourlyData(hourly);
    insertDailyData(daily);
  }
  start();
}

function timeConverter(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000);

  let hour = a.getHours();
  let min = a.getMinutes();
  let time = hour + ":" + min;
  return time;
}

function timeConverterDaily(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  /* const days = ["Mon", "Tues", "Wedn", "Thurs", "Fri", "Sat", "Sun"]; */
  const days = ["Воскр", "Пон", "Втор", "Ср", "Чет", "Пят", "Суб"];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let day = days[a.getDay()];
  let time = day;
  return time;
}

console.log(timeConverterDaily(1659754800));


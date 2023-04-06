let datetime;
let city = document.getElementById("city");
let currentWeather = document.getElementById("weather");
let temperature = document.getElementById("temp");
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const apiKey = "36436c95061ae098cf6936fb4e6899cb";



setInterval(() => {
    const time = new Date();
    const day = time.getDay();
    const hourMin = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    datetime = days[day] + ", " + hourMin;
}, 1000);

function checkDay(d) {
    const day = new Date();
    if (d + day.getDay() > 6) {
        return d + day.getDay() - 7;
    }
    else {
        return d + day.getDay();
    }
}

getInitialWeather();

function getInitialWeather() {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat
            + "&lon=" + lon
            + "&units=metric&appid=" + apiKey).then(response => {
                if (!response.ok) {
                    throw new Error(`Could not fetch weather data for ${city}`);
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                console.error(error);
            });

        fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat
            + "&lon=" + lon
            + "&units=metric&appid=" + apiKey).then(response => {
                if (!response.ok) {
                    throw new Error(`Could not fetch weather data for ${city}`);
                }
                return response.json();
            })
            .then(data => {
                displayForecast(data);
            })
            .catch(error => {
                console.error(error);
            });

    })
}

function getWeather(city) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey).then(response => {
        if (!response.ok) {
            throw new Error(`Could not fetch latitude and longitude for ${city}`);
        }
        return response.json();
    })
        .then(data => {
            if (data.length === 0) {
                throw new Error(`Could not find latitude and longitude for ${city}`);
            }
            const { lat, lon } = data[0];
            return fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat
                + "&lon=" + lon
                + "&units=metric&appid=" + apiKey);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not fetch weather data for ${city}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error(error);
        });
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey).then(response => {
        if (!response.ok) {
            throw new Error(`Could not fetch latitude and longitude for ${city}`);
        }
        return response.json();
    })
        .then(data => {
            if (data.length === 0) {
                throw new Error(`Could not find latitude and longitude for ${city}`);
            }
            const { lat, lon } = data[0];
            return fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat
                + "&lon=" + lon
                + "&units=metric&appid=" + apiKey);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not fetch forecast data for ${city}`);
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error(error);
        });
}

// function getForecast(city) {
//     fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey).then(response => {
//         if (!response.ok) {
//             throw new Error(`Could not fetch latitude and longitude for ${city}`);
//         }
//         return response.json();
//     })
//         .then(data => {
//             if (data.length === 0) {
//                 throw new Error(`Could not find latitude and longitude for ${city}`);
//             }
//             const { lat, lon } = data[0];
//             return fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat
//                 + "&lon=" + lon
//                 + "&units=metric&appid=" + apiKey);
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Could not fetch forecast data for ${city}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             displayForecast(data);
//         })
//         .catch(error => {
//             console.error(error);
//         });
// }

function displayWeather(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, temp_min, temp_max, humidity } = data.main;
    const { speed } = data.wind;

    currentWeather.innerHTML =
        `<div class="weather" id="weather">
                    <h1 class="city" id="city">${name}</h1>
                    <h4 class="datetime" id="datetime">${datetime}</h4>
                    <div class="details">
                        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="" class="icon">
                        <div class="description" id="description">${description}</div>
                    </div>
                    <div class="humidity" id="humidity">Humidity: ${humidity}%</div>
                    <div class="wind" id="wind">Wind: ${speed} km/h</div>
                </div>`;

    temperature.innerHTML =
        `<div class="current_temp">${Math.round(temp)}°</div>
    <div class="range">H: ${Math.round(temp_max)}°/L: ${Math.round(temp_min)}°</div>`;
}

function displayForecast(data) {
    for (i = 7; i < 41; i += 8) {
        document.getElementById("low-high" + i).innerHTML = "L: " + Math.round(Number(data.list[i].main.temp_min)) + "° | H: " + Math.round(Number(data.list[i].main.temp_max)) + "°";
        document.getElementById("icon" + i).src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
    }
    for (i = 1; i < 6; i++) {
        document.getElementById("day" + i).innerHTML = days[checkDay(i)];
    }
    for (i = 0; i < 8; i++) {
        document.getElementById("htemp" + (i + 1)).innerHTML = Math.round(Number(data.list[i].main.temp)) + "°";
        document.getElementById("hicon" + (i + 1)).src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
    }
}


function search() {
    getWeather(document.querySelector(".searchbar").value);
}

const searchButton = document.getElementById("searchBtn");

searchButton.addEventListener("click", () => {
    search();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchButton.click();
    }
});



let forecast = document.getElementById("forecast");
let hour_forecast = document.getElementById("hour-forecast");
const dailyBtn = document.getElementById("dailyBtn");
const hourlyBtn = document.getElementById("hourlyBtn");

dailyBtn.addEventListener("click", () => {
    forecast.style.display = 'flex';
    hour_forecast.style.display = 'none';
    hourlyBtn.style.border = "none";
    hourlyBtn.style.color = "rgb(255, 255, 255,0.7)";
    hourlyBtn.style.fontSize = "22px";
    dailyBtn.style.borderBottom = "3px solid white";
    dailyBtn.style.color = "white";
    dailyBtn.style.fontSize = "25px";
});


hourlyBtn.addEventListener("click", () => {
    forecast.style.display = 'none';
    hour_forecast.style.display = 'flex';
    dailyBtn.style.border = "none";
    dailyBtn.style.color = "rgb(255, 255, 255,0.7)";
    dailyBtn.style.fontSize = "22px";
    hourlyBtn.style.borderBottom = "3px solid white";
    hourlyBtn.style.color = "white";
    hourlyBtn.style.fontSize = "25px";
});
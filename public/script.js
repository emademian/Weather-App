const apiKey = "36436c95061ae098cf6936fb4e6899cb";

let city = document.getElementById("city");
let currentWeather = document.getElementById("weather");
let temperature = document.getElementById("temp");
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let datetime = days[new Date().getDay()] + ', ' + new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });


// function used to display a clock that updates in real-time 
setInterval(() => {
    const time = new Date();
    const day = time.getDay();
    const hourMin = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    datetime = days[day] + ", " + hourMin;
}, 1000);


// function used to calculate the day of the week
function checkDay(d) {
    const day = new Date();
    if (d + day.getDay() > 6) {
        return d + day.getDay() - 7;
    }
    else {
        return d + day.getDay();
    }
}


// function used to calculate the next 8 hours, each 3 hours ahead of the previous one
function getNext8Hours() {
    const hours = [];
    let now = new Date();
    for (let i = 0; i < 8; i++) {
        now = new Date(now.getTime() + (3 * 60 * 60 * 1000));
        let hour = now.getHours();
        let suffix = " AM";
        if (hour >= 12) {
            suffix = " PM";
            if (hour > 12) {
                hour -= 12;
            }
        } else if (hour === 0) {
            hour = 12;
        }
        hour = hour.toString().padStart(2, "0");
        hours.push(hour + suffix);
    }
    return hours;
}


getInitialWeather();


// function used to get the current weather and forecast data for the user's current location
function getInitialWeather() {
    // get the user's current location
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // get the current weather data
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat
            + "&lon=" + lon
            + "&units=metric&appid=" + apiKey).then(response => {
                if (!response.ok) {
                    throw new Error(`Could not fetch weather data for ${city}`);
                }
                return response.json();
            })
            .then(data => {
                // display weather data
                displayWeather(data);
            })
            .catch(error => {
                console.error(error);
            });
        // get the forecast data
        fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat
            + "&lon=" + lon
            + "&units=metric&appid=" + apiKey).then(response => {
                if (!response.ok) {
                    throw new Error(`Could not fetch forecast data for ${city}`);
                }
                return response.json();
            })
            .then(data => {
                // display forecast data
                displayForecast(data);
            })
            .catch(error => {
                console.error(error);
            });

    })
}


// function used to get the weather and forecast data of a certain city
// if the city is not found, an alert appears
function getWeather(city) {
    // get the city's latitude and longitutde 
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey).then(response => {
        if (!response.ok) {
            alert(`Could not fetch latitude and longitude for ${city}!\nMake sure you entered the city correctly!`);
            throw new Error(`Could not fetch latitude and longitude for ${city}`);
        }
        return response.json();
    })
        .then(data => {
            if (data.length === 0) {
                alert(`Could not find latitude and longitude for ${city}!\nMake sure you entered the city correctly!`);
                throw new Error(`Could not find latitude and longitude for ${city}`);
            }
            const { lat, lon } = data[0];
            // get the current weather data
            return fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat
                + "&lon=" + lon
                + "&units=metric&appid=" + apiKey);
        })
        .then(response => {
            if (!response.ok) {
                alert(`Could not fetch weather data for ${city}!\nMake sure you entered the city correctly!`);
                throw new Error(`Could not fetch weather data for ${city}`);
            }
            return response.json();
        })
        .then(data => {
            // display weather data
            displayWeather(data);
        })
        .catch(error => {
            console.error(error);
        });
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey).then(response => {
        if (!response.ok) {
            alert(`Could not fetch latitude and longitude for ${city}!\nMake sure you entered the city correctly!`);
            throw new Error(`Could not fetch latitude and longitude for ${city}`);
        }
        return response.json();
    })
        .then(data => {
            if (data.length === 0) {
                alert(`Could not find latitude and longitude for ${city}!\nMake sure you entered the city correctly!`);
                throw new Error(`Could not find latitude and longitude for ${city}`);
            }
            const { lat, lon } = data[0];
            // get the forecast data
            return fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat
                + "&lon=" + lon
                + "&units=metric&appid=" + apiKey);
        })
        .then(response => {
            if (!response.ok) {
                alert(`Could not fetch forecast data for ${city}!\nMake sure you entered the city correctly!`);
                throw new Error(`Could not fetch forecast data for ${city}`);
            }
            return response.json();
        })
        .then(data => {
            // display forecast data
            displayForecast(data);
        })
        .catch(error => {
            console.error(error);
        });
}


// function used to display weather information on the webpage
function displayWeather(data) {

    document.getElementById("city").innerHTML = data.name;
    document.getElementById("datetime").innerHTML = datetime;
    document.getElementById("icon").src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    document.getElementById("description").innerHTML = data.weather[0].description;
    document.getElementById("humidity").innerHTML = "Humidity: " + data.main.humidity + "%";
    document.getElementById("wind").innerHTML = "Wind: " + Math.round(data.wind.speed) + " km/h";
    document.getElementById("current_temp").innerHTML = Math.round(data.main.temp) + "°";
    document.getElementById("range").innerHTML = "H: " + Math.round(data.main.temp_max) + "°/L: " + Math.round(data.main.temp_min) + "°";

    let main_description = data.weather[0].main;
    let daytime = data.weather[0].icon.slice(2, 3);
    let body = document.body;

    if (main_description == "Clear" && daytime == "d") {
        body.style.backgroundImage = "url('/images/clouds-sun.jpeg')";
    }
    if (main_description == "Clear" && daytime == "n") {
        body.style.backgroundImage = "url('/images/clear-sky-night.jpeg')";
    }
    if (main_description == "Clouds" && daytime == "d") {
        body.style.backgroundImage = "url('/images/clouds.jpeg')";
    }
    if (main_description == "Clouds" && daytime == "n") {
        body.style.backgroundImage = "url('/images/clouds-night.jpeg')";
    }
    if (main_description == "Rain" || main_description == "Drizzle") {
        body.style.backgroundImage = "url('/images/rain.jpeg')";
    }
    if (main_description == "Snow") {
        body.style.backgroundImage = "url('/images/snow.jpeg')";
    }
    if (main_description == "Thunderstorm") {
        body.style.backgroundImage = "url('/images/thunderstorm.jpeg')";
    }
    if (main_description == "Mist" || main_description == "Fog" || main_description == "Smoke" || main_description == "Haze") {
        body.style.backgroundImage = "url('/images/fog.jpeg')";
    }
}


// function used to display forecast information on the webpage
function displayForecast(data) {
    for (i = 7; i < 41; i += 8) {
        document.getElementById("low-high" + i).innerHTML = "L: " + Math.round(Number(data.list[i].main.temp_min)) + "° | H: " + Math.round(Number(data.list[i].main.temp_max)) + "°";
        document.getElementById("icon" + i).src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
    }
    for (i = 1; i < 6; i++) {
        document.getElementById("day" + i).innerHTML = days[checkDay(i)];
    }
    let hours = getNext8Hours();
    for (i = 0; i < 8; i++) {
        document.getElementById("htemp" + (i + 1)).innerHTML = Math.round(Number(data.list[i].main.temp)) + "°";
        document.getElementById("hicon" + (i + 1)).src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
    }
    for (i = 0; i < 7; i++) {
        document.getElementById("hour" + (i + 1)).innerHTML = hours[i];
    }
}


// function used to display information about a searched city
function search() {
    getWeather(document.querySelector(".searchbar").value);
    // unfill the icon star if the city is not in the favourites list
    if (!isInList(document.querySelector(".searchbar").value.trim())) {
        starSvg.setAttribute("d", "M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z");
    }
    // else fill it if the city is in the list
    else {
        starSvg.setAttribute("d", "M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z");
    }
}

const searchButton = document.getElementById("searchBtn");


// functions used to call search() when the button is clicked or when the "Enter" key is pressed
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


// functions used to switch between the daily forecast and hourly forecast when the corresponding button is clicked
dailyBtn.addEventListener("click", () => {
    // hide the hourly forecast and show the daily one
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
    // hide the daily forecast and show the hourly one
    forecast.style.display = 'none';
    hour_forecast.style.display = 'flex';
    dailyBtn.style.border = "none";
    dailyBtn.style.color = "rgb(255, 255, 255,0.7)";
    dailyBtn.style.fontSize = "22px";
    hourlyBtn.style.borderBottom = "3px solid white";
    hourlyBtn.style.color = "white";
    hourlyBtn.style.fontSize = "25px";
});


const favBtn = document.getElementById("favBtn");
let starSvg = document.getElementById("starSvg");


// function used to add a city to the favourites list
favBtn.addEventListener("click", () => {
    favBtn.classList.add("rotate");
    setTimeout(() => {
        favBtn.classList.remove("rotate");
    }, 1000);
    // if the star icon is not filled, fill it and call addItem()
    if (starSvg.getAttribute("d") === "M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z") {
        starSvg.setAttribute("d", "M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z");
        addItem();
    }
    // else unfill it and call removeItem()
    else {
        starSvg.setAttribute("d", "M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z");
        removeItem();
    }
});


// function used to add a city to the favourites list
function addItem() {
    let favList = document.getElementById("favList");
    let newItem = document.createElement("li");
    let city = document.getElementById("city");
    newItem.innerHTML = city.innerHTML
    favList.appendChild(newItem)
}


// function used to remove a city from the favourites list
function removeItem() {
    let favList = document.getElementById("favList");
    let city = document.getElementById("city");
    for (let i = 0; i < favList.children.length; i++) {
        if (favList.children[i].textContent == city.textContent) {
            favList.removeChild(favList.children[i]);
            break;
        }
    }
}


// function used to check if a city is in the favourites list
function isInList(value) {
    let list = document.getElementById("favList");
    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].innerHTML.toLowerCase() == value.toLowerCase()) {
            return true;
        }
    }
    return false;
}


const menuBtn = document.getElementById("menuBtn");
let favDiv = document.getElementById("favorites");


// function used to open the menu(favourites list) when the menu button is clicked
menuBtn.addEventListener("click", () => {
    favDiv.classList.toggle("fav-visible");
    favDiv.style.zIndex = "1";
})

let favList = document.getElementById("favList");
let cityFromList = '';


// function used to display the weather of a city in the favourites list when it is selected(clicked)
favList.addEventListener("click", (event) => {
    if (event.target.nodeName === "LI") {
        cityFromList = event.target.textContent;
        starSvg.setAttribute("d", "M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z");
        getWeather(cityFromList);
    }
});

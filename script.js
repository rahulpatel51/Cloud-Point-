const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "51edf978e785632cedb7f67b217a481e"; // Replace with your OpenWeatherMap API key

const createWeatherCard = (cityName, weatherItem, index) => {
    const weatherDate = weatherItem.dt_txt.split(" ")[0];
    const temperature = (weatherItem.main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
    const windSpeed = weatherItem.wind.speed;
    const humidity = weatherItem.main.humidity;
    const icon = weatherItem.weather[0].icon;
    const description = weatherItem.weather[0].description;

    if (index === 0) {
        // Main current weather card
        return `
            <div class="details">
                <h2>${cityName} (${weatherDate})</h2>
                <h6>Temperature: ${temperature}°C</h6>
                <h6>Wind: ${windSpeed} M/S</h6>
                <h6>Humidity: ${humidity}%</h6>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather-icon">
                <h6>${description}</h6>
            </div>`;
    } else {
        // 5-day forecast card
        return `
            <li class="card">
                <h3>${weatherDate}</h3>
                <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather-icon">
                <h6>Temp: ${temperature}°C</h6>
                <h6>Wind: ${windSpeed} M/S</h6>
                <h6>Humidity: ${humidity}%</h6>
            </li>`;
    }
};

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            const uniqueDays = [];
            const fiveDayForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueDays.includes(forecastDate)) {
                    uniqueDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            // Clear previous weather data
            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            // Generate weather cards
            fiveDayForecast.forEach((weatherItem, index) => {
                const html = createWeatherCard(cityName, weatherItem, index);
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                }
            });
        })
        .catch(() => {
            alert("Error fetching weather data. Please try again.");
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return alert("Please enter a valid city name.");
    
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.length) {
                return alert(`No coordinates found for "${cityName}". Please try another city.`);
            }
            const { lat, lon, name } = data[0]; // Get latitude, longitude, and city name
            getWeatherDetails(name, lat, lon); // Call function to fetch weather details
        })
        .catch(() => {
            alert("Error fetching coordinates. Please try again.");
        });
};

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        getCityCoordinates();
    }
});

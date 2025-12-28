const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm"
};

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        // Geocoding API
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.results) {
            alert("City not found");
            return;
        }

        const { latitude, longitude, country, name } = geoData.results[0];

        // Weather API
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=apparent_temperature`
        );
        const weatherData = await weatherRes.json();

        const current = weatherData.current_weather;
        const feelsLike = weatherData.hourly.apparent_temperature[0];

        const now = new Date().toLocaleString();

        document.getElementById("location").innerText =
            `${name}, ${country}`;
        document.getElementById("datetime").innerText = now;
        document.getElementById("temperature").innerText =
            `${current.temperature}°C`;
        document.getElementById("feelsLike").innerText =
            `Feels like ${feelsLike}°C`;
        document.getElementById("description").innerText =
            weatherCodes[current.weathercode] || "Unknown weather";

        document.getElementById("weatherCard").style.display = "block";

    } catch (error) {
        alert("Error fetching weather data");
    }
}

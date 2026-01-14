const cityInput = document.getElementById("cityInput");
const historyList = document.getElementById("historyList");
const weatherResult = document.getElementById("weatherResult");

const API_KEY = "6c0572c78dfaa49e68c9b9791f1aecbb"; 

loadHistory();

/* =========================
   Fetch Weather
========================= */
async function getWeather(cityFromClick) {
  const city = cityFromClick || cityInput.value.trim();
  if (!city) return;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) {
      throw new Error("City not found");
    }

    const data = await res.json();

    weatherResult.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>🌡 Temperature: ${data.main.temp} °C</p>
      <p>🌥 Weather: ${data.weather[0].description}</p>
      <p>💨 Wind: ${data.wind.speed} m/s</p>
    `;

    saveHistory(city);
    loadHistory();
    cityInput.value = "";

  } catch (error) {
    weatherResult.innerHTML = `<p style="color:red;">❌ Can't fetch data</p>`;
    console.error(error);
  }
}

/* =========================
   History Functions
========================= */
function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 5) history.pop();
  }

  localStorage.setItem("weatherHistory", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  historyList.innerHTML = "";

  history.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => getWeather(city);
    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("weatherHistory");
  loadHistory();
}

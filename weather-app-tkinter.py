import tkinter as tk
from tkinter import messagebox
import urllib.request
import json
from datetime import datetime

# Weather code mapping
WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
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
}

def get_weather(city):
    geo_url = (
        f"https://geocoding-api.open-meteo.com/v1/search?"
        f"name={city}&count=1&language=en&format=json"
    )

    try:
        with urllib.request.urlopen(geo_url) as response:
            geo_data = json.loads(response.read().decode())

            if "results" in geo_data and geo_data["results"]:
                location = geo_data["results"][0]
                lat = location["latitude"]
                lon = location["longitude"]
                country = location["country"]

                weather_url = (
                    f"https://api.open-meteo.com/v1/forecast?"
                    f"latitude={lat}&longitude={lon}"
                    f"&current_weather=true"
                    f"&hourly=apparent_temperature"
                )

                with urllib.request.urlopen(weather_url) as w_response:
                    weather_data = json.loads(w_response.read().decode())
                    current = weather_data["current_weather"]

                    weather_desc = WEATHER_CODES.get(
                        current["weathercode"], "Unknown weather"
                    )

                    # Get current time & date
                    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                    # Feels-like temperature (first hourly value)
                    feels_like = weather_data["hourly"]["apparent_temperature"][0]

                    return (
                        f"City: {city}\n"
                        f"Country: {country}\n"
                        f"Date & Time: {now}\n"
                        f"Temperature: {current['temperature']}°C\n"
                        f"Feels Like: {feels_like}°C\n"
                        f"Weather: {weather_desc}"
                    )
            else:
                return "City not found."

    except Exception as e:
        return f"Error retrieving data: {e}"


def on_submit():
    city = city_entry.get().strip()

    if city:
        result = get_weather(city)
        result_label.config(text=result)
    else:
        messagebox.showwarning("Input Error", "Please enter a city name.")


# ----------- Tkinter UI -----------
root = tk.Tk()
root.title("Weather App")
root.geometry("420x360")

tk.Label(root, text="Enter City Name:").pack(pady=10)

city_entry = tk.Entry(root)
city_entry.pack(pady=5)

tk.Button(root, text="Get Weather", command=on_submit).pack(pady=10)

result_label = tk.Label(root, text="", justify=tk.LEFT)
result_label.pack(pady=10)

root.mainloop()

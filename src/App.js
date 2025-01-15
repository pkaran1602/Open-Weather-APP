import React, { useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  const getWeatherDetails = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=d72a7444611f87990909580d8fc1b963&lang=en`
      );
      setData(response.data);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  const searchLocation = async (event) => {
    if (event.key === "Enter") {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=d72a7444611f87990909580d8fc1b963`
        );
        setCities(response.data);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
      setLocation("");
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
          aria-label="Enter city name to get the weather"
        />
      </div>
      <div className="city">
        {cities.length > 0 ? (
          <ul>
            {cities.map((city, index) => (
              <li key={index} onClick={() => getWeatherDetails(city)}>
                {city.name} {city?.state ? `, ${city.state}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p>No cities found. Please try another search.</p>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              {data.main ? <h1>{(data.main.temp - 273.15).toFixed(1)}°C</h1> : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>
          {data.name && (
            <div className="bottom">
              <div className="feels">
                {data.main ? (
                  <p className="bold">{(data.main.feels_like - 273.15).toFixed(1)}°C</p>
                ) : null}
                <p>Feels Like</p>
              </div>
              <div className="humidity">
                {data.main ? (
                  <p className="bold">{data.main.humidity}%</p>
                ) : null}
                <p>Humidity</p>
              </div>
              <div className="wind">
                {data.wind ? (
                  <p className="bold">{data.wind.speed.toFixed()} m/s</p>
                ) : null}
                <p>Wind Speed</p>
              </div>
            </div>
          )}
        </div>
      )}
      {error && (
        <p className="error">Unable to fetch weather data. Please try again.</p>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';

const GetWeather = ({ coordinates }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const TOMORROW_IO_API_KEY = import.meta.env.VITE_TOMORROW_IO_API_KEY;

  const targetHours = [8, 14, 19]

  useEffect(() => {
    if (coordinates) {
      const fetchWeather = async () => {
        try {
          const response = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${coordinates.lat},${coordinates.lng}&apikey=${TOMORROW_IO_API_KEY}`);
          const data = await response.json()
          console.log('Fetched weather data:', data)

          if (data.timelines && data.timelines.hourly && data.timelines.hourly.length > 0) {
            const hourlyData = data.timelines.hourly
            const filteredData = hourlyData.filter(hour => {
              const hourTime = new Date(hour.time).getHours()
              return targetHours.includes(hourTime)
            }).map(hour => ({
              time: new Date(hour.time).getTime(),
              formattedTime: new Date(hour.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
              temperature: hour.values.temperature,
              precipitationProbability: hour.values.precipitationProbability,
              humidity: hour.values.humidity
            }));

            setWeatherData(filteredData)
          } else {
            setError('Unexpected data format')
          }
        } catch (error) {
          console.error('Error fetching weather data:', error)
          setError('Error fetching weather data')
        }
      }

      fetchWeather()
    }
  }, [coordinates, TOMORROW_IO_API_KEY])

  const selectedWeather = weatherData

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : weatherData ? (
        <div>
          {weatherData.map((weather, index) => (
            <div key={index}>
              <p>Date and Time: {weather.formattedTime}</p>
              <p>Temperature: {weather.temperature} °C</p>
              <p>Precipitation Probability: {weather.precipitationProbability} %</p>
              <p>Humidity: {weather.humidity} %</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default GetWeather;

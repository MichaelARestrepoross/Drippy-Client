import React, { useState, useEffect } from 'react';

const GetWeather = ({ coordinates, selectedWeatherData, setSelectedWeatherData }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const TOMORROW_IO_API_KEY = import.meta.env.VITE_TOMORROW_IO_API_KEY;

  useEffect(() => {
    if (coordinates) {
      const fetchWeather = async () => {
        try {
          const response = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${coordinates.lat},${coordinates.lng}&timesteps=1m&apikey=${TOMORROW_IO_API_KEY}`);
          const data = await response.json();
          
          if (data.timelines && data.timelines.minutely && data.timelines.minutely.length > 0) {
            const minutelyData = data.timelines.minutely;
            const currentMinute = new Date().getMinutes();
            const currentMinuteData = minutelyData.find(minute => {
              const minuteTime = new Date(minute.time).getMinutes();
              return minuteTime === currentMinute;
            });

            if (currentMinuteData) {
              const filteredData = {
                time: new Date(currentMinuteData.time).getTime(),
                formattedTime: new Date(currentMinuteData.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                temperature: currentMinuteData.values.temperature,
                precipitationProbability: currentMinuteData.values.precipitationProbability,
                humidity: currentMinuteData.values.humidity
              };

              setWeatherData([filteredData]);
              setSelectedWeatherData([filteredData]);
              console.log(filteredData);
            } else {
              setError('No data available for the current minute');
            }
          } else {
            setError('Unexpected data format');
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
          setError('Error fetching weather data');
        }
      };

      fetchWeather();
    }
  }, []);

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

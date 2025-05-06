export const mockWeatherData = {
  current: {
    temp_c: 28,
    condition: {
      text: "धूप",
      icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
    },
    humidity: 65,
    wind_kph: 12
  },
  forecast: {
    forecastday: [
      {
        date: new Date().toISOString(),
        day: {
          maxtemp_c: 32,
          mintemp_c: 24,
          condition: {
            text: "धूप",
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
          }
        }
      },
      {
        date: new Date(Date.now() + 86400000).toISOString(),
        day: {
          maxtemp_c: 30,
          mintemp_c: 23,
          condition: {
            text: "आंशिक बादल",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
          }
        }
      },
      {
        date: new Date(Date.now() + 172800000).toISOString(),
        day: {
          maxtemp_c: 29,
          mintemp_c: 22,
          condition: {
            text: "हल्की बारिश",
            icon: "//cdn.weatherapi.com/weather/64x64/day/296.png"
          }
        }
      }
    ]
  }
}; 
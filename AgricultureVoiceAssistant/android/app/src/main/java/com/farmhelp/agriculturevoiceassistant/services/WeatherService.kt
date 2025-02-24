class WeatherService(private val context: Context) {
    suspend fun getCurrentWeather(lat: Double, lon: Double): WeatherInfo {
        // Get weather data from API
        return WeatherInfo(
            temperature = 32,
            condition = "SUNNY",
            rainProbability = 20,
            alerts = listOf("Heavy rain expected tonight")
        )
    }

    suspend fun getWeatherForecast(days: Int = 7): List<WeatherInfo> {
        // Get weekly forecast
        return listOf()
    }
}

data class WeatherInfo(
    val temperature: Int,
    val condition: String,
    val rainProbability: Int,
    val alerts: List<String>
) 
class IrrigationService(
    private val weatherService: WeatherService
) {
    suspend fun getIrrigationAdvice(
        crop: String,
        soilType: String,
        landSize: Float
    ): IrrigationAdvice {
        val weather = weatherService.getWeatherForecast(7)
        
        return IrrigationAdvice(
            shouldIrrigate = true,
            waterNeeded = "2000 liters",
            bestTime = "Early morning",
            reason = "No rain expected in next 3 days",
            waterSavingTips = listOf(
                "Use drip irrigation",
                "Irrigate during cooler hours"
            )
        )
    }
} 
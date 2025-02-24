class CropAdvisoryService(
    private val llamaService: LlamaService,
    private val weatherService: WeatherService
) {
    suspend fun getSuggestions(
        location: String,
        landSize: Float,
        soilType: String
    ): List<CropSuggestion> {
        val weather = weatherService.getCurrentWeather(0.0, 0.0)
        
        // Get personalized suggestions using LLaMA
        val prompt = """
            Given:
            - Location: $location
            - Land size: $landSize acres
            - Soil type: $soilType
            - Current temperature: ${weather.temperature}°C
            - Rain probability: ${weather.rainProbability}%
            
            Suggest suitable crops considering:
            1. Local climate
            2. Market demand
            3. Water availability
            4. Traditional farming patterns
        """.trimIndent()

        val response = llamaService.generate(prompt)
        // Parse LLaMA response into suggestions
        return parseSuggestions(response)
    }
}

data class CropSuggestion(
    val cropName: String,
    val confidence: Int,
    val waterNeeds: String,
    val expectedReturn: String,
    val risks: List<String>
) 
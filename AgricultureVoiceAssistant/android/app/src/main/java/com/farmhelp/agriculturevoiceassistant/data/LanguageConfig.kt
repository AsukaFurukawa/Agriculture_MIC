data class LanguageConfig(
    val code: String,
    val displayName: String,
    val translations: Map<String, String>
)

object Languages {
    val SUPPORTED = mapOf(
        "hi-IN" to LanguageConfig(
            code = "hi-IN",
            displayName = "हिंदी",
            translations = mapOf(
                "weather" to "मौसम",
                "market_prices" to "बाज़ार भाव",
                "speak" to "बोलें"
                // Add more translations
            )
        ),
        "kn-IN" to LanguageConfig(
            code = "kn-IN",
            displayName = "ಕನ್ನಡ",
            translations = mapOf(
                "weather" to "ಹವಾಮಾನ",
                "market_prices" to "ಮಾರುಕಟ್ಟೆ ದರ",
                "speak" to "ಮಾತನಾಡಿ"
            )
        )
        // Add more languages
    )
} 
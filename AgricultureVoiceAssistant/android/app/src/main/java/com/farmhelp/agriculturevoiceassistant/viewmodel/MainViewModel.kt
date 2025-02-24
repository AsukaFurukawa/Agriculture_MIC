package com.farmhelp.agriculturevoiceassistant.viewmodel

import android.util.Log
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import com.farmhelp.agriculturevoiceassistant.ai.LlamaService
import com.farmhelp.agriculturevoiceassistant.data.Languages
import com.farmhelp.agriculturevoiceassistant.data.LanguageConfig
import com.farmhelp.agriculturevoiceassistant.services.*

class MainViewModel(
    private val llamaService: LlamaService,
    private val speechService: SpeechService,
    private val weatherService: WeatherService,
    private val marketService: MarketService,
    private val schemeService: SchemeService,
    private val cropAdvisoryService: CropAdvisoryService,
    private val ttsService: TextToSpeechService,
    private val emergencyService: EmergencyService,
    private val financeService: FinanceService,
    private val communityService: CommunityService
) : ViewModel() {
    
    private val _currentLanguage = mutableStateOf(Languages.SUPPORTED["hi-IN"]!!)
    val currentLanguage: State<LanguageConfig> = _currentLanguage

    private val _voiceState = mutableStateOf<VoiceState>(VoiceState.Idle)
    val voiceState: State<VoiceState> = _voiceState

    private val _weatherState = MutableStateFlow<WeatherState>(WeatherState.Loading)
    val weatherState: StateFlow<WeatherState> = _weatherState

    private var _isProcessing = mutableStateOf(false)
    val isProcessing: State<Boolean> = _isProcessing

    init {
        viewModelScope.launch {
            try {
                Log.d("MainViewModel", "Initializing ViewModel")
                // Clear memory
                Runtime.getRuntime().gc()
            } catch (e: Exception) {
                Log.e("MainViewModel", "Error in init", e)
            }
        }
        viewModelScope.launch {
            speechService.recognizedText.collect { text ->
                if (text.isNotEmpty()) {
                    processVoiceInput(text)
                }
            }
        }
    }

    fun updateLanguage(locationState: String) {
        val newLanguage = when(locationState) {
            "Karnataka" -> Languages.SUPPORTED["kn-IN"]
            "Tamil Nadu" -> Languages.SUPPORTED["ta-IN"]
            else -> Languages.SUPPORTED["hi-IN"]
        }
        _currentLanguage.value = newLanguage!!
    }

    private suspend fun processVoiceInput(text: String) {
        try {
            _voiceState.value = VoiceState.Processing
            
            // Clear memory before processing
            Runtime.getRuntime().gc()
            
            // Process voice input
            when {
                text.contains("मौसम") -> handleWeatherQuery()
                text.contains("भाव") -> handlePriceQuery()
                text.contains("फसल") -> handleCropSuggestion()
                text.contains("कीट") || text.contains("ಕೀಟ") -> handleEmergency(text)
                text.contains("बाढ़") || text.contains("ಪ್ರವಾಹ") -> handleEmergency(text)
                
                // Kannada
                text.contains("ಹವಾಮಾನ") -> handleWeatherQuery()
                text.contains("ಬೆಲೆ") -> handlePriceQuery()
                text.contains("ಬೆಳೆ") -> handleCropSuggestion()
                
                // Default: Use LLaMA for general queries
                else -> {
                    val response = llamaService.getSmartResponse(
                        query = text,
                        language = currentLanguage.value.code,
                        context = getCurrentContext()
                    )
                    _voiceState.value = VoiceState.Speaking(response)
                }
            }
        } catch (e: Exception) {
            Log.e("MainViewModel", "Error processing voice input", e)
            _voiceState.value = VoiceState.Error(e.message ?: "Unknown error")
        } finally {
            _isProcessing.value = false
        }
    }

    private fun getCurrentContext() = FarmContext(
        location = "Current Location",
        season = getCurrentSeason(),
        landSize = 20f,
        soilType = "Red Soil",
        rainfall = 800
    )

    fun getTranslation(key: String): String {
        return currentLanguage.value.translations[key] ?: key
    }

    private suspend fun handleWeatherQuery() {
        val weather = weatherService.getCurrentWeather(0.0, 0.0)
        val response = getTranslatedWeatherResponse(weather)
        _voiceState.value = VoiceState.Speaking(response)
    }

    private suspend fun handlePriceQuery() {
        val prices = marketService.getCropPrices("current_location")
        val response = getTranslatedPriceResponse(prices)
        _voiceState.value = VoiceState.Speaking(response)
    }

    private suspend fun handleCropSuggestion() {
        val suggestions = cropAdvisoryService.getSuggestions(
            location = "current_location",
            landSize = 20f,
            soilType = "Red Soil"
        )
        val response = getTranslatedSuggestionResponse(suggestions)
        _voiceState.value = VoiceState.Speaking(response)
    }

    private suspend fun handleEmergency(text: String) {
        when {
            text.contains("कीट") || text.contains("ಕೀಟ") -> {
                EmergencyType.PEST_ATTACK
            }
            text.contains("बाढ़") || text.contains("ಪ್ರವಾಹ") -> {
                EmergencyType.FLOOD
            }
            // More emergency types...
        }.let { emergencyType ->
            emergencyService.sendEmergencyAlert(emergencyType)
        }
    }

    private suspend fun handleLoanQuery() {
        val loans = financeService.getLoanOptions(20f, "wheat")
        val response = getTranslatedLoanResponse(loans)
        _voiceState.value = VoiceState.Speaking(response)
    }

    private suspend fun handleCommunityHelp() {
        val help = communityService.getNearbyHelp()
        val response = getTranslatedCommunityResponse(help)
        _voiceState.value = VoiceState.Speaking(response)
    }
}

sealed class VoiceState {
    object Idle : VoiceState()
    object Listening : VoiceState()
    object Processing : VoiceState()
    data class Speaking(val text: String) : VoiceState()
    data class Error(val message: String) : VoiceState()
}

sealed class WeatherState {
    object Loading : WeatherState()
    data class Success(val temperature: Int, val condition: String) : WeatherState()
    data class Error(val message: String) : WeatherState()
} 
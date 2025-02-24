package com.farmhelp.agriculturevoiceassistant.di

import android.content.Context
import android.util.Log
import com.farmhelp.agriculturevoiceassistant.services.*
import com.farmhelp.agriculturevoiceassistant.ai.LlamaService

class AppContainer(private val context: Context) {
    
    init {
        Log.i("AppContainer", "Starting initialization")
    }
    
    val llamaService by lazy {
        Log.d("AppContainer", "Initializing LlamaService")
        try {
            LlamaService(context).also {
                Log.d("AppContainer", "LlamaService initialized successfully")
            }
        } catch (e: Exception) {
            Log.e("AppContainer", "Error initializing LlamaService", e)
            throw e
        }
    }
    
    val speechService by lazy {
        Log.d("AppContainer", "Initializing SpeechService")
        try {
            SpeechService(context).also {
                Log.d("AppContainer", "SpeechService initialized successfully")
            }
        } catch (e: Exception) {
            Log.e("AppContainer", "Error initializing SpeechService", e)
            throw e
        }
    }
    
    val weatherService by lazy {
        Log.d("AppContainer", "Creating WeatherService")
        WeatherService(context)
    }
    
    val marketService by lazy {
        Log.d("AppContainer", "Creating MarketService")
        MarketService(context)
    }
    
    val schemeService by lazy {
        Log.d("AppContainer", "Creating SchemeService")
        SchemeService(context)
    }
    
    val cropAdvisoryService by lazy {
        Log.d("AppContainer", "Creating CropAdvisoryService")
        CropAdvisoryService(llamaService, weatherService)
    }
    
    val ttsService by lazy {
        Log.d("AppContainer", "Creating TextToSpeechService")
        TextToSpeechService(context)
    }
    
    val emergencyService by lazy {
        Log.d("AppContainer", "Creating EmergencyService")
        EmergencyService(context)
    }
    
    val financeService by lazy {
        Log.d("AppContainer", "Creating FinanceService")
        FinanceService(context)
    }
    
    val communityService by lazy {
        Log.d("AppContainer", "Creating CommunityService")
        CommunityService(context)
    }
    
    init {
        Log.i("AppContainer", "Initialization complete")
    }
} 
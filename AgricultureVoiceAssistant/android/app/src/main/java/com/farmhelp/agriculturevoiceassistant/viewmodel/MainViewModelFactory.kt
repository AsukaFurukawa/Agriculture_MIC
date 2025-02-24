package com.farmhelp.agriculturevoiceassistant.viewmodel

import android.content.Context
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.farmhelp.agriculturevoiceassistant.FarmHelpApp
import com.farmhelp.agriculturevoiceassistant.di.AppContainer

class MainViewModelFactory(private val context: Context) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        Log.i("MainViewModelFactory", "Creating ViewModel of type: ${modelClass.simpleName}")
        
        if (modelClass.isAssignableFrom(MainViewModel::class.java)) {
            try {
                Log.d("MainViewModelFactory", "Getting AppContainer from application context")
                val app = context.applicationContext as? FarmHelpApp
                    ?: throw IllegalStateException("Application is not FarmHelpApp")
                
                Log.d("MainViewModelFactory", "Getting container from FarmHelpApp")
                val container = app.container
                
                Log.d("MainViewModelFactory", "Creating MainViewModel with container services")
                @Suppress("UNCHECKED_CAST")
                return MainViewModel(
                    llamaService = container.llamaService,
                    speechService = container.speechService,
                    weatherService = container.weatherService,
                    marketService = container.marketService,
                    schemeService = container.schemeService,
                    cropAdvisoryService = container.cropAdvisoryService,
                    ttsService = container.ttsService,
                    emergencyService = container.emergencyService,
                    financeService = container.financeService,
                    communityService = container.communityService
                ).also {
                    Log.i("MainViewModelFactory", "MainViewModel created successfully")
                } as T
            } catch (e: Exception) {
                Log.e("MainViewModelFactory", "Error creating MainViewModel", e)
                throw e
            }
        }
        throw IllegalArgumentException("Unknown ViewModel class: ${modelClass.name}")
    }
} 
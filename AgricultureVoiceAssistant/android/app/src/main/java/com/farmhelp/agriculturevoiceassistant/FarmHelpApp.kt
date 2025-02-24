package com.farmhelp.agriculturevoiceassistant

import android.app.Application
import android.content.Context
import android.util.Log
import com.farmhelp.agriculturevoiceassistant.di.AppContainer

class FarmHelpApp : Application() {
    companion object {
        private const val TAG = "FarmHelpApp"
    }

    lateinit var container: AppContainer
        private set
    
    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(base)
        Log.i(TAG, "attachBaseContext called")
    }
    
    override fun onCreate() {
        super.onCreate()
        Log.i(TAG, "Application onCreate started")
        
        try {
            // Verify storage access
            val filesDir = filesDir
            val cacheDir = cacheDir
            Log.d(TAG, "Files dir: ${filesDir.absolutePath}")
            Log.d(TAG, "Cache dir: ${cacheDir.absolutePath}")
            
            Log.d(TAG, "Starting AppContainer initialization")
            container = AppContainer(this)
            Log.i(TAG, "AppContainer initialized successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Fatal error initializing AppContainer", e)
            throw e
        }
    }

    override fun onLowMemory() {
        super.onLowMemory()
        Log.w(TAG, "onLowMemory called")
        Runtime.getRuntime().gc()
    }
} 
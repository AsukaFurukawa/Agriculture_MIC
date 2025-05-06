package com.farmhelp.agriculturevoiceassistant.ai

import android.content.Context
import android.util.Log
import java.io.File
import java.io.IOException

class LlamaService(private val context: Context) {
    
    companion object {
        private const val TAG = "LlamaService"
        private const val MODEL_FILENAME = "ggml-model-q4_0.bin"
        private const val TEMP_DIR = "llama_temp"
        private const val OFFLINE_MODEL_FILENAME = "ggml-model-q4_0.bin"
        private const val CACHE_DIR = "llama_cache"
    }

    init {
        try {
            Log.i(TAG, "Initializing LlamaService")
            
            // Create temp directory if it doesn't exist
            val tempDir = File(context.cacheDir, TEMP_DIR)
            if (!tempDir.exists()) {
                Log.d(TAG, "Creating temp directory")
                if (!tempDir.mkdirs()) {
                    throw IOException("Failed to create temp directory")
                }
            }
            
            // Clean up old temp files
            cleanupTempFiles()
            
            // Check if model file exists
            val modelFile = File(context.filesDir, MODEL_FILENAME)
            if (!modelFile.exists()) {
                Log.w(TAG, "Model file not found at ${modelFile.absolutePath}")
            }
            
            Log.i(TAG, "LlamaService initialized successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing LlamaService", e)
            throw e
        }
    }

    private fun cleanupTempFiles() {
        try {
            val tempDir = File(context.cacheDir, TEMP_DIR)
            val filesDeleted = tempDir.listFiles()?.count { file ->
                if (file.isFile && System.currentTimeMillis() - file.lastModified() > 24 * 60 * 60 * 1000) {
                    file.delete()
                } else false
            } ?: 0
            Log.d(TAG, "Cleaned up $filesDeleted old temp files")
        } catch (e: Exception) {
            Log.w(TAG, "Error cleaning temp files", e)
        }
    }

    fun processQuery(query: String): String {
        try {
            Log.d(TAG, "Processing query: $query")
            // Add memory management
            Runtime.getRuntime().gc()
            
            // Process query logic here
            return "Response to: $query"
        } catch (e: Exception) {
            Log.e(TAG, "Error processing query", e)
            throw e
        }
    }

    // Comment out or remove LlamaModel temporarily for testing
    // private val llm = LlamaModel(context)
    
    suspend fun getSmartResponse(
        query: String,
        language: String,
        context: FarmContext
    ): String {
        Log.d(TAG, "Getting response for query: $query in language: $language")
        try {
            // For testing, return a dummy response
            return "Test response"
        } catch (e: Exception) {
            Log.e(TAG, "Error getting smart response", e)
            throw e
        }
    }

    // Add offline capabilities
    private fun setupOfflineSupport() {
        try {
            val modelFile = File(context.filesDir, OFFLINE_MODEL_FILENAME)
            if (!modelFile.exists()) {
                Log.d(TAG, "Downloading model for offline use")
                // Download model when internet is available
                // Store in internal storage
            }
        } catch (e: Exception) {
            Log.w(TAG, "Error setting up offline support", e)
        }
    }

    // Support both online and offline modes
    suspend fun getResponse(query: String, isOnline: Boolean): String {
        return if (isOnline) {
            // Use cloud API
            getOnlineResponse(query)
        } else {
            // Use offline model
            getOfflineResponse(query)
        }
    }
}

data class FarmContext(
    val location: String,
    val season: String,
    val landSize: Float,
    val soilType: String,
    val rainfall: Int
) 
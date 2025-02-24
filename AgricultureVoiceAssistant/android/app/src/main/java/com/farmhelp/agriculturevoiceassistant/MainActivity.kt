package com.farmhelp.agriculturevoiceassistant

import android.os.Bundle
import android.os.StatFs
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.farmhelp.agriculturevoiceassistant.ui.theme.AgricultureVoiceAssistantTheme
import com.farmhelp.agriculturevoiceassistant.viewmodel.MainViewModel
import com.farmhelp.agriculturevoiceassistant.viewmodel.MainViewModelFactory

class MainActivity : ComponentActivity() {
    companion object {
        private const val TAG = "MainActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.i(TAG, "Starting onCreate")
        
        try {
            // Verify application context
            val app = applicationContext as? FarmHelpApp
            if (app == null) {
                Log.e(TAG, "Application is not FarmHelpApp")
                showError("Application initialization failed")
                return
            }
            
            // Check available storage
            val stat = StatFs(applicationContext.filesDir.path)
            val availableBytes = stat.availableBytes
            val minimumRequired = 100 * 1024 * 1024 // 100MB minimum
            
            Log.d(TAG, "Available storage: ${availableBytes/1024/1024}MB")
            
            if (availableBytes < minimumRequired) {
                Log.e(TAG, "Not enough storage space available")
                showError("Not enough storage space available. Please free up some space.")
                return
            }
            
            setContent {
                Log.i(TAG, "Starting setContent")
                AgricultureVoiceAssistantTheme {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = MaterialTheme.colorScheme.background
                    ) {
                        try {
                            Log.d(TAG, "Creating ViewModel")
                            val context = LocalContext.current
                            val viewModel: MainViewModel = viewModel(
                                factory = MainViewModelFactory(context)
                            )
                            Log.i(TAG, "ViewModel created successfully")
                            MainScreen(viewModel)
                        } catch (e: Exception) {
                            Log.e(TAG, "Error creating ViewModel", e)
                            Text("Error: ${e.message}")
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Fatal error in onCreate", e)
            showError("Fatal error: ${e.message}")
        }
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}

@Composable
fun MainScreen(viewModel: MainViewModel) {
    var showPermissionDialog by remember { mutableStateOf(false) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Header
        Text(
            text = "किसान मित्र",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.primary
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Weather Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "आज का मौसम",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = "32°C - साफ़ आसमान",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Market Prices Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "बाज़ार भाव",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = "गेहूं: ₹2200/क्विंटल",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        }
        
        // Push mic button to bottom
        Spacer(modifier = Modifier.weight(1f))
        
        // Mic Button
        FloatingActionButton(
            onClick = { showPermissionDialog = true },
            modifier = Modifier.size(72.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Mic,
                contentDescription = "Voice Command",
                modifier = Modifier.size(32.dp)
            )
        }
    }
    
    if (showPermissionDialog) {
        AlertDialog(
            onDismissRequest = { showPermissionDialog = false },
            title = { Text("माइक की अनुमति चाहिए") },
            text = { Text("आवाज़ से बात करने के लिए माइक की अनुमति दें") },
            confirmButton = {
                TextButton(onClick = { showPermissionDialog = false }) {
                    Text("ठीक है")
                }
            }
        )
    }
} 
import android.Manifest
import androidx.compose.animation.core.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import com.google.accompanist.permissions.rememberPermissionState

@Composable
fun VoiceCommandButton(
    viewModel: MainViewModel = viewModel(),
    modifier: Modifier = Modifier
) {
    var isListening by remember { mutableStateOf(false) }
    val micPermissionState = rememberPermissionState(Manifest.permission.RECORD_AUDIO)
    
    // Pulsing animation for mic button
    val infiniteTransition = rememberInfiniteTransition()
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.2f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000),
            repeatMode = RepeatMode.Reverse
        )
    )

    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        FloatingActionButton(
            onClick = {
                if (micPermissionState.hasPermission) {
                    isListening = !isListening
                    if (isListening) {
                        startVoiceRecognition(viewModel)
                    }
                } else {
                    micPermissionState.launchPermissionRequest()
                }
            },
            modifier = Modifier.scale(if (isListening) scale else 1f)
        ) {
            Icon(
                imageVector = if (isListening) 
                    Icons.Default.Mic 
                else 
                    Icons.Default.MicNone,
                contentDescription = viewModel.getTranslation("speak"),
                tint = if (isListening) 
                    MaterialTheme.colorScheme.error 
                else 
                    MaterialTheme.colorScheme.primary
            )
        }

        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = viewModel.getTranslation(
                if (isListening) "listening" else "speak"
            ),
            style = MaterialTheme.typography.bodyMedium
        )
    }
}

private fun startVoiceRecognition(viewModel: MainViewModel) {
    viewModel.viewModelScope.launch {
        try {
            // Start listening
            val voiceCommand = speechRecognizer.listen()
            
            // Process with LLaMA
            val response = viewModel.processVoiceCommand(voiceCommand)
            
            // Speak response in local language
            textToSpeech.speak(
                response,
                viewModel.currentLanguage.value.code
            )
            
        } catch (e: Exception) {
            // Handle error
        }
    }
} 
package com.farmhelp.agriculturevoiceassistant.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColors = lightColorScheme(
    primary = androidx.compose.ui.graphics.Color(0xFF1B5E20),  // Dark Green
    secondary = androidx.compose.ui.graphics.Color(0xFF33691E), // Forest Green
    tertiary = androidx.compose.ui.graphics.Color(0xFF004D40)  // Dark Teal
)

@Composable
fun AgricultureVoiceAssistantTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColors,
        content = content
    )
} 
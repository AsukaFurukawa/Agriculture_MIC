package com.farmhelp.agriculturevoiceassistant.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.runtime.livedata.viewModel
import com.farmhelp.agriculturevoiceassistant.viewmodel.MainViewModel

@Composable
fun MarketPricesCard(
    modifier: Modifier = Modifier,
    viewModel: MainViewModel = viewModel()  // Inject ViewModel
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = viewModel.getTranslation("market_prices"),
                style = MaterialTheme.typography.titleLarge
            )
            
            Spacer(modifier = Modifier.height(8.dp))

            // Price Items
            PriceItem(
                cropName = "गेहूं",
                price = "₹2,200/क्विंटल",
                trend = PriceTrend.UP
            )
            
            Divider(modifier = Modifier.padding(vertical = 8.dp))
            
            PriceItem(
                cropName = "धान",
                price = "₹1,900/क्विंटल",
                trend = PriceTrend.DOWN
            )
            
            Divider(modifier = Modifier.padding(vertical = 8.dp))
            
            PriceItem(
                cropName = "मक्का",
                price = "₹1,800/क्विंटल",
                trend = PriceTrend.STABLE
            )
        }
    }
}

@Composable
private fun PriceItem(
    cropName: String,
    price: String,
    trend: PriceTrend
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = cropName,
            style = MaterialTheme.typography.bodyLarge
        )
        
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = price,
                style = MaterialTheme.typography.bodyLarge,
                color = trend.color
            )
            Icon(
                imageVector = trend.icon,
                contentDescription = trend.description,
                tint = trend.color,
                modifier = Modifier.size(24.dp)
            )
        }
    }
}

enum class PriceTrend(
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val description: String,
    val color: Color
) {
    UP(
        icon = Icons.Default.TrendingUp,
        description = "Price increasing",
        color = Color(0xFF4CAF50)  // Green
    ),
    DOWN(
        icon = Icons.Default.TrendingDown,
        description = "Price decreasing",
        color = Color(0xFFF44336)  // Red
    ),
    STABLE(
        icon = Icons.Default.TrendingFlat,
        description = "Price stable",
        color = Color(0xFF2196F3)  // Blue
    )
} 
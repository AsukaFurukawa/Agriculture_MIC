class MarketService(private val context: Context) {
    suspend fun getCropPrices(location: String): List<CropPrice> {
        return listOf(
            CropPrice("गेहूं", 2200.0, PriceTrend.UP),
            CropPrice("धान", 1900.0, PriceTrend.DOWN),
            CropPrice("मक्का", 1800.0, PriceTrend.STABLE)
        )
    }

    suspend fun findBuyers(crop: String, quantity: Int): List<BuyerInfo> {
        // Find nearby buyers
        return listOf()
    }
}

data class CropPrice(
    val name: String,
    val price: Double,
    val trend: PriceTrend
)

data class BuyerInfo(
    val name: String,
    val distance: Int,
    val offering: Double,
    val transport: Boolean
) 
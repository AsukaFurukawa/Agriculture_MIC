class SchemeService(private val context: Context) {
    suspend fun getActiveSchemes(): List<SchemeInfo> {
        return listOf(
            SchemeInfo(
                name = "PM-KISAN",
                deadline = "2024-03-31",
                benefit = "₹6000 per year",
                documents = listOf("Aadhaar", "Land Records")
            )
        )
    }
}

data class SchemeInfo(
    val name: String,
    val deadline: String,
    val benefit: String,
    val documents: List<String>
) 
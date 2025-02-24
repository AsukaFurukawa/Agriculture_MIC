class CommunityService(private val context: Context) {
    suspend fun getNearbyHelp(): List<CommunityResource> {
        return listOf(
            CommunityResource(
                type = ResourceType.EQUIPMENT,
                name = "Tractor",
                owner = "Ramesh",
                contact = "9876543210",
                distance = "1km",
                rate = "₹500/hour"
            ),
            CommunityResource(
                type = ResourceType.LABOR,
                name = "Harvesting Team",
                owner = "Suresh",
                contact = "9876543211",
                distance = "2km",
                rate = "₹400/person/day"
            )
        )
    }

    suspend fun shareResource(resource: CommunityResource) {
        // Share your resources with community
    }
}

enum class ResourceType {
    EQUIPMENT, LABOR, TRANSPORT, STORAGE
} 
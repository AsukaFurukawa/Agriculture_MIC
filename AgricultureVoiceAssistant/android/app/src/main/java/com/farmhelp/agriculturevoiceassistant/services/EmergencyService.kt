class EmergencyService(private val context: Context) {
    fun sendEmergencyAlert(type: EmergencyType) {
        when (type) {
            EmergencyType.PEST_ATTACK -> notifyPestControl()
            EmergencyType.FLOOD -> notifyDisasterManagement()
            EmergencyType.EQUIPMENT_FAILURE -> findNearbyMechanic()
            EmergencyType.MEDICAL -> callAmbulance()
        }
    }

    private fun getEmergencyContacts(): List<String> {
        return listOf(
            "Local Agriculture Officer: 1800-XXX-XXX",
            "Veterinary Doctor: 1800-XXX-XXX",
            "Weather Warning: 1800-XXX-XXX"
        )
    }
} 
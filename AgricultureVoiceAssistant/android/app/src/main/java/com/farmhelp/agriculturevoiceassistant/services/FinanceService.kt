class FinanceService(private val context: Context) {
    suspend fun getLoanOptions(
        landSize: Float,
        crop: String
    ): List<LoanOption> {
        return listOf(
            LoanOption(
                name = "Kisan Credit Card",
                maxAmount = "₹50,000",
                interestRate = "7%",
                documents = listOf("Aadhaar", "Land Records"),
                nearestBranch = "SBI Rajajinagar - 3km"
            )
        )
    }

    suspend fun getInsuranceOptions(): List<InsuranceScheme> {
        return listOf(
            InsuranceScheme(
                name = "Pradhan Mantri Fasal Bima Yojana",
                coverage = "All natural calamities",
                premium = "2% of sum insured",
                lastDate = "2024-03-31"
            )
        )
    }
} 
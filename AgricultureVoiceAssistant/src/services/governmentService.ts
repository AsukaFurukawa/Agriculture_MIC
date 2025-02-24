interface SchemeAlert {
  schemeName: string;
  deadline: Date;
  benefits: string;
  requiredDocuments: string[];
  nearestCenter: string;
}

export const governmentService = {
  async getActiveSchemes(location: string, language: string) {
    // Get real-time updates about:
    // - PM Kisan payments
    // - Crop insurance deadlines
    // - MSP announcements
    // - Subsidy programs
  }
}; 
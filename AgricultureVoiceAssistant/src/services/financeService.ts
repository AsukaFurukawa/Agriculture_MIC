interface LoanInfo {
  bankName: string;
  interestRate: number;
  maxAmount: number;
  documents: string[];
  nearestBranch: string;
}

export const financeService = {
  async getEmergencyFinanceOptions(location: string) {
    // Help with:
    // 1. Emergency loan options
    // 2. Loan restructuring
    // 3. Interest payment extensions
    // 4. Government support schemes
    
    return {
      quickLoans: await getKCCOptions(location),
      debtRelief: await getDebtReliefSchemes(),
      helplineNumber: '1800-XXX-XXX'
    };
  }
}; 
interface Equipment {
  type: string;  // tractor, harvester, etc.
  availableFrom: Date;
  costPerDay: number;
  ownerContact: string;
  distance: number;
}

export const equipmentService = {
  async findNearbyEquipment() {
    // Help farmers:
    // - Share expensive machinery
    // - Find rental equipment
    // - Schedule usage
    // - Compare rental rates
  }
}; 
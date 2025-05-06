interface TraditionalSign {
  indicator: string;
  meaning: string;
  reliability: number;
  season: string[];
}

export class TraditionalWeatherService {
  private static readonly TRADITIONAL_SIGNS: TraditionalSign[] = [
    {
      indicator: "दक्षिण से आने वाली हवा",
      meaning: "वर्षा की संभावना",
      reliability: 0.8,
      season: ["monsoon"]
    },
    {
      indicator: "चींटियों का झुंड में चलना",
      meaning: "बारिश का आगमन",
      reliability: 0.7,
      season: ["pre-monsoon", "monsoon"]
    },
    {
      indicator: "बगुलों का नीचे उड़ना",
      meaning: "आने वाली बारिश",
      reliability: 0.75,
      season: ["monsoon"]
    },
    {
      indicator: "सूर्यास्त के समय लाल आसमान",
      meaning: "अगले दिन अच्छा मौसम",
      reliability: 0.65,
      season: ["winter", "summer"]
    }
  ];

  static getRelevantSigns(season: string, location: string): TraditionalSign[] {
    return this.TRADITIONAL_SIGNS.filter(sign => 
      sign.season.includes(season) &&
      sign.reliability > 0.6
    );
  }

  static interpretSigns(signs: TraditionalSign[]): string {
    return signs
      .map(sign => `${sign.indicator}: ${sign.meaning}`)
      .join('\n');
  }
} 
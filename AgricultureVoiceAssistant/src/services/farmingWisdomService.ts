interface FarmingAdvice {
  condition: string;
  crops: string[];
  traditional_practice: string;
  modern_adaptation: string;
  precautions: string[];
}

export class FarmingWisdomService {
  private static readonly WISDOM_DATABASE: FarmingAdvice[] = [
    {
      condition: "pre-monsoon",
      crops: ["धान", "मक्का", "ज्वार"],
      traditional_practice: "खेत की मेड़बंदी और जल निकासी की व्यवस्था",
      modern_adaptation: "वैज्ञानिक विधि से जल प्रबंधन",
      precautions: [
        "बीज को उपचारित करें",
        "खेत की समतल जुताई करें",
        "जल निकासी के लिए नाली बनाएं"
      ]
    },
    {
      condition: "heavy_rain",
      crops: ["सभी फसलें"],
      traditional_practice: "मेड़ों की मरम्मत और जल निकासी",
      modern_adaptation: "आधुनिक जल निकासी प्रणाली",
      precautions: [
        "फसल को गिरने से बचाएं",
        "कीटनाशकों का छिड़काव टालें",
        "अतिरिक्त पानी निकालें"
      ]
    }
  ];

  static getAdvice(weather: string, crops: string[]): FarmingAdvice[] {
    return this.WISDOM_DATABASE.filter(advice =>
      advice.condition === weather ||
      advice.crops.some(crop => crops.includes(crop))
    );
  }
} 
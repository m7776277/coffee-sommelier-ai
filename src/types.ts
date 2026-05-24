export interface Parameter {
  label: string;
  value: string;
}

export interface RecommendationCard {
  title: string;
  description: string;
  parameters: Parameter[];
  actionText: string;
}

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  recommendationType?: "coffee" | "subscription" | "grind" | "storage" | "shipping" | "none";
  recommendationCard?: RecommendationCard;
}

export interface KBRecord {
  category: string;
  question: string;
  answer: string;
  tags: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  starterQuestion: string;
  description: string;
}

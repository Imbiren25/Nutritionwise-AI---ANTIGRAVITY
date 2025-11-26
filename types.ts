export type Page = 'home' | 'assessments' | 'ai-assistant' | 'reports' | 'profile' | 'assessment-runner' | 'stock-inventory' | 'glossary' | 'conversion-tool' | 'pdf-viewer' | 'data-and-privacy' | 'privacy-policy' | 'tutorials' | 'ifct-library' | 'games';

export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface AppearanceSettings {
  theme: Theme;
  fontSize: FontSize;
  boldText: boolean;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  college: string;
  course: string;
  batch: string;
  avatarUrl: string;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cookingMethod: 'Raw' | 'Boiled' | 'Steamed' | 'Fried' | 'Roasted' | 'Other';
  // Base nutrient values for quantity = 1
  baseEnergy: number;
  baseProtein: number;
  baseFat: number;
  baseCarbs: number;
  baseFiber: number;
  baseB12: number;
  baseZinc: number;
  // Metadata
  category?: string;
  region?: string;
  // Total calculated values
  energy: number; // kcal
  protein: number; // g
  fat: number; // g
  carbs: number; // g
  fiber: number; // g
  b12: number; // mcg
  zinc: number; // mg
}

export interface IFCTFood {
  id: string;
  name: string;
  group: 'cereals' | 'pulses' | 'oils' | 'vegetables' | 'fruits' | 'dairy' | 'eggs' | 'meat' | 'sugars' | 'mixed';
  aliases?: string[];
  source: 'ifct' | 'ai';
  per100g: {
    energy: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    iron: number;
    calcium: number;
    vitaminA: number;
    zinc: number;
  };
}

export interface NutrientIntake {
  energy: number;
  protein: number;
  fat: number;
  carbs: number;
  iron: number;
  calcium: number;
  vitaminA: number;
  b12: number;
  zinc: number;
  fiber: number;
}

export interface AssessmentData {
  respondentContext: {
    isSelf: boolean;
    relationToRespondent: string;
  };
  sectionA: {
    name: string;
    age: number;
    ageInMonths?: number; // Added for infants
    sex: 'Male' | 'Female' | 'Other';
    maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced';
    educationStatus: 'Illiterate' | 'Primary' | 'Secondary' | 'Higher Secondary' | 'Graduate & Above';
  };
  sectionB: {
    weight: number;
    height: number;
    muac: number; // Added for children
    bmi: number;
    bmiCategory: string;
    // New Anthropometry Fields
    birthWeight?: number;
    birthLength?: number;
    headCircumference?: number;
    chestCircumference?: number;
    waistCircumference?: number;
    hipCircumference?: number;
    tsf?: number; // Triceps Skinfold
  };
  sectionC: {
    hofName: string;
    hofRelation: string;
    hofEducation: 'Illiterate' | 'Primary' | 'Secondary' | 'Higher Secondary' | 'Graduate & Above' | 'Professional';
    hofOccupation: 'Unemployed' | 'Unskilled' | 'Semi-skilled' | 'Skilled' | 'Clerical/Shop' | 'Semi-professional' | 'Professional';
  };
  sectionD: {
    location: 'Urban - Non Slum' | 'Urban - Slum' | 'Rural' | 'Tribal' | 'Peri-Urban';
  };
  sectionE: {
    income: number;
    ses: string;
  };
  sectionF: {
    waterSource: 'Tap' | 'Well' | 'Hand Pump' | 'Tanker' | 'Other';
    cookingFuel: 'LPG' | 'Firewood' | 'Kerosene' | 'Cow Dung' | 'Other';
    dietaryPattern: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian';
    marketAccess: 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly';
    storageFacilities: 'Refrigerator' | 'Cooler' | 'None' | 'Other';
    electricity: 'Reliable' | 'Intermittent' | 'None';
    perishablesFrequency: 'Daily' | 'Weekly' | 'Rarely';
    foodSafetyConcerns: string;
  };
  sectionG: {
    activityLevel: 'Sedentary' | 'Light Exercise' | 'Moderate Exercise' | 'Vigorous' | 'Very Intense';
    physiologicalState: 'NPNL' | 'Pregnant' | 'Lactating';
    occupation: string;
    waterIntake: number;
    foodAllergies: string;
    medicalConditions: string;
  };
  sectionH: {
    isTypicalDay: 'Yes' | 'No';
    dayType: 'Normal' | 'Festival' | 'Sick' | 'Travel' | 'Fasting' | 'Party' | 'Medication';
  };
  sectionI: {
    meals: {
      earlyMorning: FoodItem[];
      breakfast: FoodItem[];
      midMorning: FoodItem[];
      lunch: FoodItem[];
      eveningSnack: FoodItem[];
      dinner: FoodItem[];
      lateNight: FoodItem[];
    };
  };
  sectionJ: {
    nutrientIntake: NutrientIntake;
    rdaComparison: NutrientIntake;
  };
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  ageInMonths?: number;
  sex: 'Male' | 'Female' | 'Other';
  physiologicalState: 'NPNL' | 'Pregnant' | 'Lactating';
  activityLevel: 'Sedentary' | 'Light Exercise' | 'Moderate Exercise' | 'Vigorous' | 'Very Intense';
  cu: number;
  // Anthropometry
  weight?: number;
  height?: number;
  muac?: number;
  birthWeight?: number;
  birthLength?: number;
  headCircumference?: number;
  chestCircumference?: number;
  waistCircumference?: number;
  hipCircumference?: number;
  tsf?: number;
}

export interface FoodStockItem {
  id: string;
  name: string;
  quantityPurchased: number;
  purchaseFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Six Monthly' | 'Yearly';
  currentBalance: number;
  unit: 'kg' | 'litre' | 'unit';
}

export type FoodStockGroup = 'cereals' | 'pulses' | 'oils' | 'vegetables' | 'fruits' | 'dairy' | 'eggs' | 'meat' | 'snacks' | 'sugars' | 'condiments';

export interface StockInventoryData {
  sectionA: AssessmentData['sectionA']; // Respondent Details
  sectionB: AssessmentData['sectionC']; // Head of Family
  sectionC: AssessmentData['sectionD']; // Location
  sectionD: AssessmentData['sectionE']; // SES
  sectionE: { // Family Composition
    familyMembers: FamilyMember[];
    totalCU: number;
  };
  sectionF: { // Food Stock Entry
    [key in FoodStockGroup]: FoodStockItem[];
  };
  sectionG: { // Adequacy Engine
    daysFoodLasts: number;
    dietaryDiversityScore: number;
    foodInsecurityRisk: 'Low' | 'Moderate' | 'Severe';
  };
}


export interface AIResponse {
  summary: string;
  key_nutrient_gaps: string[];
  food_suggestions: {
    protein?: string[];
    iron?: string[];
    calcium?: string[];
    fiber?: string[];
    vitamin_a?: string[];
    zinc?: string[];
  };
  meal_wise_improvements: string[];
  affordable_swaps: string[];
  hydration_activity: {
    water: string;
    activity: string;
  };
  disclaimer: string;
}


export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: { text: string }[];
  error?: boolean;
}

export interface CompletedReport {
  id: string;
  type: '24-Hour Recall' | 'Stock Inventory';
  respondentName: string;
  completionDate: string;
  data: AssessmentData | StockInventoryData;
  aiResponse?: AIResponse;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  action?: () => void;
}

export interface AnalyticsSettings {
  analyticsEnabled: boolean;
  crashReportsEnabled: boolean;
}

export interface FeatureFlags {
  enable_24hr: boolean;
  enable_stock: boolean;
  enable_ai_chat: boolean;
}

export interface AppConfig {
  minVersion: string;
  latestVersion: string;
  forceUpdate: boolean;
  maintenanceMode: boolean;
  bannerMessage: string;
  criticalAlert: string;
  featureFlags: FeatureFlags;
}

export interface AiUsageStats {
  freeCount: number;
  rewardedCount: number;
  lastReset: string; // YYYY-MM-DD
}
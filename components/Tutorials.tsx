import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Icon from './Icon';
import { Page } from '../types';
import Badge from './ui/Badge';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'assessment' | 'tracking' | 'nutrition' | 'advanced';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sections: TutorialSection[];
  prerequisites?: string[];
}

interface TutorialSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'interactive' | 'quiz' | 'demo' | 'note' | 'tip';
  image?: string; // Placeholder for future images
  action?: {
    label: string;
    navigateTo?: Page;
    function?: () => void;
  };
}

interface TutorialsProps {
  setActivePage: (page: Page) => void;
}

const tutorialsData: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with NutritionWise',
    description: 'Learn the basics of navigating the app and understanding key features',
    category: 'basics',
    duration: 5,
    difficulty: 'beginner',
    sections: [
      {
        id: 'welcome',
        title: 'Welcome to NutritionWise',
        content: 'NutritionWise is your comprehensive nutrition assessment and tracking platform. This guide will walk you through the main features and help you get started with your first nutrition assessment.',
        type: 'text'
      },
      {
        id: 'navigation',
        title: 'Understanding Navigation',
        content: 'The app is organized into five main sections to help you manage your nutrition journey effectively:\n\n• Home: Your dashboard with quick stats and daily overview.\n• Assessments: Conduct detailed nutrition evaluations like 24-Hour Recall.\n• AI Assistant: Get personalized nutrition guidance and answers.\n• Reports: View detailed analysis of your assessments.\n• Profile: Manage your personal settings and preferences.\n\nUse the bottom navigation bar on mobile or the sidebar on desktop to switch between these sections.',
        type: 'text'
      },
      {
        id: 'assessment-intro',
        title: 'Nutrition Assessments',
        content: 'NutritionWise offers two primary types of assessments:\n\n1. 24-Hour Recall: A detailed analysis of everything you ate and drank in the last 24 hours.\n2. Stock Inventory: An evaluation of your household food availability and storage conditions.\n\nBoth assessments work together to provide a complete picture of your nutritional status.',
        type: 'note'
      },
      {
        id: 'first-assessment',
        title: 'Try Your First Assessment',
        content: 'Ready to conduct your first nutrition assessment? We recommend starting with a 24-Hour Recall to analyze your current dietary intake patterns.',
        type: 'interactive',
        action: {
          label: 'Start Assessment',
          navigateTo: 'assessments'
        }
      }
    ]
  },
  {
    id: '24-hour-recall',
    title: 'Mastering 24-Hour Recall Assessment',
    description: 'Comprehensive guide to conducting accurate dietary intake assessments',
    category: 'assessment',
    duration: 15,
    difficulty: 'intermediate',
    prerequisites: ['getting-started'],
    sections: [
      {
        id: 'recall-basics',
        title: 'What is a 24-Hour Recall?',
        content: 'The 24-Hour Recall method is a retrospective dietary assessment tool. It captures detailed information about all foods and beverages consumed in the previous 24 hours, from midnight to midnight. This includes meal timing, portion sizes, cooking methods, and specific ingredients used.',
        type: 'text'
      },
      {
        id: 'portion-guide',
        title: 'Estimating Portion Sizes Accurately',
        content: 'Accurate portion size estimation is crucial for reliable results. Since you might not weigh every meal, use these common references:\n\n• 1 Cup (200ml): About the size of a baseball or a closed fist.\n• 1 Tablespoon (15ml): About the size of your thumb.\n• 1 Teaspoon (5ml): About the size of your thumb tip.\n• Palm Size: Good for estimating meat or fish portions (approx. 3oz).\n• Fist Size: Good for estimating vegetable portions (approx. 1 cup).',
        type: 'demo'
      },
      {
        id: 'meal-timing',
        title: 'Recording Meal Times',
        content: 'Documenting the exact time of each eating occasion is important. It helps identify eating patterns, meal frequency, and long gaps between meals that might affect your energy levels and metabolism.',
        type: 'text'
      },
      {
        id: 'ingredient-details',
        title: 'Detailed Ingredient Documentation',
        content: 'When recording mixed dishes, list individual ingredients whenever possible. For example, instead of just writing "Vegetable Curry", record:\n\n• Potato (100g)\n• Tomato (50g)\n• Onion (30g)\n• Oil (10ml)\n• Spices (5g)\n\nThis level of detail allows for much more accurate nutrient calculations.',
        type: 'tip'
      },
      {
        id: 'cooking-methods',
        title: 'Impact of Cooking Methods',
        content: 'How you cook your food matters. Different methods affect nutrient retention:\n\n• Boiling: Can cause loss of water-soluble vitamins (like Vitamin C and B vitamins).\n• Steaming: Generally preserves more nutrients than boiling.\n• Frying: Adds fat content and calorie density.\n• Roasting: May reduce some heat-sensitive vitamins but concentrates flavors.',
        type: 'text'
      },
      {
        id: 'practice-quiz',
        title: 'Test Your Knowledge',
        content: 'Ready to apply what you\'ve learned? Try a practice assessment to see how accurate your recall is.',
        type: 'quiz',
        action: {
          label: 'Practice Assessment',
          navigateTo: 'assessments'
        }
      }
    ]
  },
  {
    id: 'stock-inventory',
    title: 'Food Stock Inventory Assessment',
    description: 'Learn to evaluate household food availability and storage conditions',
    category: 'assessment',
    duration: 10,
    difficulty: 'intermediate',
    sections: [
      {
        id: 'inventory-purpose',
        title: 'Why Conduct a Stock Inventory?',
        content: 'A stock inventory assesses food availability, variety, and storage conditions in your household. It helps identify:\n\n• Food Security Levels: Do you have enough food for the coming days/weeks?\n• Dietary Diversity: Do you have a good mix of food groups available?\n• Storage Practices: Are foods stored in a way that maintains their quality and safety?',
        type: 'text'
      },
      {
        id: 'food-categories',
        title: 'Categorizing Your Stock',
        content: 'Organize your inventory into these key categories:\n\n• Cereals: Rice, wheat, oats, millets.\n• Pulses: Dal, beans, lentils.\n• Vegetables: Fresh, frozen, or root vegetables.\n• Fruits: Fresh or dried.\n• Dairy: Milk, curd, cheese, paneer.\n• Proteins: Meat, fish, eggs.\n• Essentials: Oils, spices, salt, sugar.\n\nThis categorization helps you quickly see if any major food group is missing.',
        type: 'demo'
      },
      {
        id: 'storage-assessment',
        title: 'Evaluating Storage Conditions',
        content: 'Proper storage extends shelf life and prevents nutrient loss. Check for:\n\n• Temperature Control: Are perishables refrigerated?\n• Moisture Protection: Are dry goods in airtight containers?\n• Pest Control: Is the storage area clean and sealed?\n• Rotation: Are you using the "First-In-First-Out" method?',
        type: 'text'
      },
      {
        id: 'quantity-estimation',
        title: 'Estimating Quantities',
        content: 'Use appropriate units for different items:\n\n• Kilograms (kg): For grains, flour, potatoes, onions.\n• Liters (L): For milk, oil, juices.\n• Count (nos): For eggs, fruits like apples or bananas.\n\nRecording both the available stock and your typical consumption rate helps estimate how long your food security will last.',
        type: 'tip'
      }
    ]
  },
  {
    id: 'nutrition-basics',
    title: 'Indian Nutrition Fundamentals',
    description: 'Essential nutrition concepts specific to Indian dietary patterns',
    category: 'nutrition',
    duration: 12,
    difficulty: 'beginner',
    sections: [
      {
        id: 'indian-diet-pattern',
        title: 'The Traditional Indian Diet',
        content: 'The traditional Indian diet is predominantly plant-based, with cereals (rice, wheat) and pulses (dal) forming the core. It emphasizes seasonal, locally available foods and uses a wide variety of spices. Common cooking methods include pressure cooking, steaming (idli), fermenting (dosa/curd), and sprouting, all of which can enhance nutritional value.',
        type: 'text'
      },
      {
        id: 'food-groups-india',
        title: 'Key Indian Food Groups',
        content: '• Cereals: Rice, Wheat, Jowar, Bajra, Ragi.\n• Pulses & Legumes: Tur dal, Moong, Chana, Rajma, Urad.\n• Vegetables: Seasonal local varieties (Gourd, Okra, Brinjal, Leafy greens).\n• Fruits: Mango, Banana, Guava, Citrus fruits.\n• Dairy: Milk, Curd (Dahi), Paneer, Ghee.\n• Nuts & Oils: Groundnut, Mustard oil, Coconut oil, Sesame.',
        type: 'demo'
      },
      {
        id: 'micronutrient-concerns',
        title: 'Common Micronutrient Deficiencies',
        content: 'Despite a rich food culture, certain deficiencies are common in India:\n\n• Iron: Anemia is widespread, especially among women and children.\n• Vitamin A: Critical for vision and immunity.\n• Vitamin D: Deficiency is common due to lifestyle and skin pigmentation, despite ample sunlight.\n• Iodine: Addressed largely through iodized salt.\n• Vitamin B12: A concern for strict vegetarians.',
        type: 'note'
      },
      {
        id: 'fortified-foods',
        title: 'The Role of Fortified Foods',
        content: 'To combat deficiencies, the government mandates fortification of staples:\n\n• Salt: Iodized.\n• Oil & Milk: Fortified with Vitamins A and D.\n• Rice & Wheat Flour: Often fortified with Iron, Folic Acid, and B12.\n\nIncorporating these fortified staples into your daily diet is an effective way to boost micronutrient intake.',
        type: 'text'
      },
      {
        id: 'seasonal-nutrition',
        title: 'Eating with the Seasons',
        content: 'Traditional wisdom emphasizes seasonal eating:\n\n• Summer: Focus on hydration (water, buttermilk, coconut water) and cooling foods like cucumber and curd.\n• Monsoon: Prioritize hygiene, cooked foods, and immunity boosters like turmeric and ginger.\n• Winter: Include energy-dense foods, root vegetables, and sesame/jaggery for warmth.',
        type: 'tip'
      }
    ]
  },
  {
    id: 'ai-assistant-guide',
    title: 'Using the AI Nutrition Assistant',
    description: 'Maximize the benefits of AI-powered nutrition guidance',
    category: 'advanced',
    duration: 8,
    difficulty: 'intermediate',
    sections: [
      {
        id: 'ai-capabilities',
        title: 'What Can the AI Assistant Do?',
        content: 'The AI Assistant is your personal nutrition companion. It can:\n\n• Analyze your assessment results.\n• Answer specific nutrition questions.\n• Suggest meal modifications for better health.\n• Identify potential nutrient gaps in your diet.\n• Provide educational info on Indian foods.',
        type: 'text'
      },
      {
        id: 'effective-prompts',
        title: 'Writing Effective Questions',
        content: 'To get the best answers, be specific. Instead of asking "What should I eat?", try:\n\n"Suggest a high-protein vegetarian breakfast for a 30-year-old active male."\n\nInclude context like age, health goals, dietary restrictions, and regional preferences.',
        type: 'demo'
      },
      {
        id: 'assessment-integration',
        title: 'Integrating with Assessments',
        content: 'The real power comes from combining AI with your data. After finishing a 24-Hour Recall, ask:\n\n"Based on my recent assessment, which nutrients am I lacking and how can I fix it with natural foods?"',
        type: 'interactive',
        action: {
          label: 'Try AI Assistant',
          navigateTo: 'ai-assistant'
        }
      },
      {
        id: 'safety-guidelines',
        title: 'Important Safety Guidelines',
        content: 'While powerful, the AI provides general educational information, not medical advice. Always consult a qualified healthcare provider or dietitian for specific medical conditions, pregnancy, or severe dietary issues.',
        type: 'note'
      }
    ]
  },
  {
    id: 'reports-analysis',
    title: 'Understanding Assessment Reports',
    description: 'Learn to interpret nutrition assessment results and recommendations',
    category: 'tracking',
    duration: 10,
    difficulty: 'intermediate',
    sections: [
      {
        id: 'report-structure',
        title: 'Anatomy of a Report',
        content: 'Your assessment report is broken down into:\n\n• Demographic Info: Your basic details.\n• Macronutrient Analysis: Carbs, Protein, Fats.\n• Micronutrient Analysis: Vitamins and Minerals.\n• Food Group Consumption: What you ate vs. recommended.\n• Dietary Diversity Score: A measure of variety.\n• Personalized Recommendations: Actionable steps to improve.',
        type: 'text'
      },
      {
        id: 'nutrient-adequacy',
        title: 'Interpreting Nutrient Adequacy',
        content: 'Look for the percentage of recommended intake:\n\n• < 70%: Risk of deficiency. Needs attention.\n• 70 - 100%: Generally adequate.\n• > 100%: Good, but watch out for upper limits on some nutrients.\n\nFocus on nutrients that are consistently low over multiple assessments.',
        type: 'demo'
      },
      {
        id: 'dietary-diversity',
        title: 'Dietary Diversity Score (DDS)',
        content: 'This score reflects the variety in your diet. A higher score generally indicates better nutrient adequacy. Aim to include at least 7 of the major food groups in your daily diet for optimal health.',
        type: 'text'
      },
      {
        id: 'recommendations',
        title: 'Acting on Recommendations',
        content: 'Don\'t try to fix everything at once. Prioritize recommendations based on:\n\n1. Severity of deficiency.\n2. Ease of implementation.\n3. Your personal preferences.\n\nSmall, sustainable changes are more effective than drastic, short-term diets.',
        type: 'tip'
      }
    ]
  }
];

const Tutorials: React.FC<TutorialsProps> = ({ setActivePage }) => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('nutritionWiseTutorials');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedTutorials(data.completed || []);
    }
  }, []);

  const markAsCompleted = (tutorialId: string) => {
    if (!completedTutorials.includes(tutorialId)) {
      const newCompleted = [...completedTutorials, tutorialId];
      setCompletedTutorials(newCompleted);
      localStorage.setItem('nutritionWiseTutorials', JSON.stringify({ completed: newCompleted }));
    }
  };

  const handleTutorialSelect = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (selectedTutorial) {
      markAsCompleted(selectedTutorial.id);
    }
    setSelectedTutorial(null);
    window.scrollTo(0, 0);
  };

  const getCategoryColor = (category: Tutorial['category']) => {
    const colors = {
      basics: 'bg-blue-100 text-blue-800 border-blue-200',
      assessment: 'bg-green-100 text-green-800 border-green-200',
      tracking: 'bg-purple-100 text-purple-800 border-purple-200',
      nutrition: 'bg-orange-100 text-orange-800 border-orange-200',
      advanced: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category];
  };

  const getDifficultyColor = (difficulty: Tutorial['difficulty']) => {
    const colors = {
      beginner: 'text-green-600',
      intermediate: 'text-yellow-600',
      advanced: 'text-red-600'
    };
    return colors[difficulty];
  };

  // Render Single Tutorial View
  if (selectedTutorial) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="space-y-4">
          <Button onClick={handleBack} variant="secondary" size="sm" className="mb-4">
            <Icon name="arrowBack" className="w-4 h-4 mr-2" />
            Back to Library
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">{selectedTutorial.title}</h1>
            <Badge variant="secondary" className={getCategoryColor(selectedTutorial.category)}>
              {selectedTutorial.category.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center space-x-6 text-sm text-[var(--text-secondary)]">
            <span className="flex items-center">
              <Icon name="schedule" className="w-4 h-4 mr-2" />
              {selectedTutorial.duration} min read
            </span>
            <span className={`flex items-center ${getDifficultyColor(selectedTutorial.difficulty)}`}>
              <Icon name="star" className="w-4 h-4 mr-2" />
              {selectedTutorial.difficulty.charAt(0).toUpperCase() + selectedTutorial.difficulty.slice(1)}
            </span>
          </div>

          <p className="text-lg text-[var(--text-secondary)] border-l-4 border-[var(--text-accent)] pl-4 py-1">
            {selectedTutorial.description}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {selectedTutorial.sections.map((section, index) => (
            <Card key={section.id} className="overflow-hidden">
              <div className="p-1">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--text-accent)] flex items-center justify-center text-sm mr-3 font-mono">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>

                <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line pl-11">
                  {section.content}
                </div>

                {/* Special Section Types */}
                {section.type === 'note' && (
                  <div className="mt-6 ml-11 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <Icon name="info" className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 text-sm uppercase tracking-wide mb-1">Note</h4>
                        <p className="text-blue-700 text-sm">Important information to keep in mind.</p>
                      </div>
                    </div>
                  </div>
                )}

                {section.type === 'tip' && (
                  <div className="mt-6 ml-11 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <Icon name="check" className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 text-sm uppercase tracking-wide mb-1">Pro Tip</h4>
                        <p className="text-green-700 text-sm">Useful advice for better results.</p>
                      </div>
                    </div>
                  </div>
                )}

                {section.type === 'demo' && (
                  <div className="mt-6 ml-11 bg-purple-50 border border-purple-100 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Icon name="visibility" className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="font-semibold text-purple-800">Example</span>
                    </div>
                    <p className="text-sm text-purple-700">See the example above for practical application.</p>
                  </div>
                )}

                {section.action && (
                  <div className="mt-6 ml-11">
                    <Button
                      onClick={() => {
                        if (section.action?.navigateTo) {
                          setActivePage(section.action.navigateTo);
                        } else if (section.action?.function) {
                          section.action.function();
                        }
                      }}
                      variant="default"
                      className="w-full sm:w-auto"
                    >
                      {section.action.label}
                      <Icon name="arrowForward" className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-8">
          <Button onClick={handleBack} variant="default" size="lg" className="px-8">
            <Icon name="check" className="w-5 h-5 mr-2" />
            Complete Tutorial
          </Button>
        </div>
      </div>
    );
  }

  // Render Tutorial Library
  const categories = ['basics', 'assessment', 'tracking', 'nutrition', 'advanced'] as const;
  const groupedTutorials = categories.reduce((acc, category) => {
    acc[category] = tutorialsData.filter(t => t.category === category);
    return acc;
  }, {} as Record<typeof categories[number], Tutorial[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-[var(--text-primary)]">Learning Center</h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Master nutrition assessment and tracking with our comprehensive guides.
          Explore tutorials designed for Indian dietary contexts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-default">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Icon name="school" className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Expert Guides</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              In-depth articles covering everything from basics to advanced analysis
            </p>
          </div>
        </Card>

        <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-default">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Icon name="checklist" className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Practical Tips</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Actionable advice you can apply immediately to your assessments
            </p>
          </div>
        </Card>

        <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-default">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Icon name="star" className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">India Focused</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Content tailored specifically for Indian foods and dietary habits
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-12">
        {categories.map(category => {
          const categoryTutorials = groupedTutorials[category];
          if (categoryTutorials.length === 0) return null;

          const categoryNames = {
            basics: 'Getting Started',
            assessment: 'Assessment Methods',
            tracking: 'Progress Tracking',
            nutrition: 'Nutrition Knowledge',
            advanced: 'Advanced Features'
          };

          return (
            <div key={category} className="space-y-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">{categoryNames[category]}</h2>
                <div className="h-px bg-[var(--border-primary)] flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTutorials.map(tutorial => {
                  const isCompleted = completedTutorials.includes(tutorial.id);

                  return (
                    <Card
                      key={tutorial.id}
                      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-[var(--text-accent)]"
                      onClick={() => handleTutorialSelect(tutorial)}
                    >
                      <div className="flex flex-col h-full space-y-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className={`${getCategoryColor(tutorial.category)} text-xs`}>
                            {tutorial.category}
                          </Badge>
                          {isCompleted && (
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center" title="Completed">
                              <Icon name="check" className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
                            {tutorial.title}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                            {tutorial.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[var(--border-primary)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                          <span className="flex items-center">
                            <Icon name="schedule" className="w-3 h-3 mr-1" />
                            {tutorial.duration} min
                          </span>
                          <span className={`flex items-center font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                            {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tutorials;
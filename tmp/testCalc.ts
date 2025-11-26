import { calculateNutrients } from '../utils/unitConversion';
import { foodDatabase } from '../components/steps/foodDatabase';

const testFood = foodDatabase[0]; // Roti/Chapathi
const result = calculateNutrients(testFood, 2, 'roti');
console.log('Result:', result);

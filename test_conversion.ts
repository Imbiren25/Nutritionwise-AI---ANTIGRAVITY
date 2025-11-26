import { getNutrientMultiplier } from './utils/unitConversion';

const testCases = [
    { unit: 'cup', category: 'Staple', name: 'Rice', expected: 2.0 },
    { unit: 'bowl', category: 'Curry', name: 'Dal', expected: 2.5 },
    { unit: 'katori', category: 'Vegetable', name: 'Sabzi', expected: 1.5 },
    { unit: 'glass', category: 'Beverage', name: 'Milk', expected: 2.5 },
    { unit: 'piece', category: 'Staple', name: 'Roti', expected: 1 },
    { unit: 'gm', category: 'Staple', name: 'Roti', expected: 1 / 40 }, // Approx 0.025
    { unit: 'gm', category: 'Staple', name: 'Rice', expected: 0.01 },
];

console.log("Running Unit Conversion Tests...");
let passed = 0;
testCases.forEach(test => {
    const result = getNutrientMultiplier(test.unit, test.category, test.name);
    const isPass = Math.abs(result - test.expected) < 0.001;
    if (isPass) passed++;
    console.log(`[${isPass ? 'PASS' : 'FAIL'}] ${test.name} (${test.unit}): Expected ${test.expected}, Got ${result}`);
});

console.log(`\nTotal Passed: ${passed}/${testCases.length}`);

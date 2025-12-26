// Test Definitions Index
// Only tests with 20+ questions

import bdiII from './bdi-ii.json';
import bai from './bai.json';
import dass21 from './dass-21.json';
import pcl5 from './pcl-5.json';
import eat26 from './eat-26.json';
import stai from './stai.json';
import scl90r from './scl-90-r.json';

// Type definitions
export interface TestOption {
    text: string;
    score: number;
}

export interface TestQuestion {
    order: number;
    text: string;
    scaleKey: string;
    riskItem?: boolean;
    reverse?: boolean;
    options: TestOption[];
}

export interface TestScale {
    key: string;
    name: string;
    nameFa: string;
}

export interface TestCutoff {
    scaleKey: string;
    min: number;
    max: number;
    label: string;
    labelFa: string;
}

export interface AnalysisTemplate {
    level_label: string;
    scaleKey: string;
    title: string;
    summary: string;
    details: string;
    recommendations: string;
    disclaimer: string;
}

export interface RiskRule {
    condition: string;
    message: string;
    severity: 'warning' | 'critical' | 'emergency';
}

export interface TestDefinition {
    slug: string;
    name: string;
    nameFa: string;
    category: string;
    categoryFa: string;
    description: string;
    descriptionFa: string;
    analysis_type: 'direct' | 'profile' | 'rule_based';
    warning: string;
    timeMinutes: number;
    scales: TestScale[];
    questions: TestQuestion[];
    cutoffs: TestCutoff[];
    analysis_templates: AnalysisTemplate[];
    risk_rules: RiskRule[];
}

// Export all test definitions (7 tests with 20+ questions)
export const TEST_DEFINITIONS: TestDefinition[] = [
    // Depression
    bdiII as TestDefinition,   // 21 questions

    // Anxiety
    bai as TestDefinition,     // 21 questions
    stai as TestDefinition,    // 40 questions (state + trait)

    // Stress (includes depression & anxiety)
    dass21 as TestDefinition,  // 21 questions

    // PTSD
    pcl5 as TestDefinition,    // 20 questions

    // Eating Disorders
    eat26 as TestDefinition,   // 26 questions

    // General Screening
    scl90r as TestDefinition,  // 90 questions
];

// Category definitions for UI
export const CATEGORIES = [
    { key: 'Depression', name: 'Depression', nameFa: 'افسردگی', icon: '😔' },
    { key: 'Anxiety', name: 'Anxiety', nameFa: 'اضطراب', icon: '😰' },
    { key: 'Stress', name: 'Stress', nameFa: 'استرس', icon: '😤' },
    { key: 'PTSD', name: 'PTSD / Trauma', nameFa: 'تروما و PTSD', icon: '💔' },
    { key: 'Eating', name: 'Eating Disorders', nameFa: 'اختلالات خوردن', icon: '🍽️' },
    { key: 'General', name: 'General Screening', nameFa: 'غربالگری عمومی', icon: '🔍' },
];

// Helper to get tests by category
export function getTestsByCategory(): Record<string, TestDefinition[]> {
    const byCategory: Record<string, TestDefinition[]> = {};

    for (const test of TEST_DEFINITIONS) {
        if (!byCategory[test.category]) {
            byCategory[test.category] = [];
        }
        byCategory[test.category].push(test);
    }

    return byCategory;
}

// Helper to get a specific test by slug
export function getTestBySlug(slug: string): TestDefinition | undefined {
    return TEST_DEFINITIONS.find(t => t.slug === slug);
}

// Default export
export default TEST_DEFINITIONS;

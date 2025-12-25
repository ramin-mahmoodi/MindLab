// Test Definitions Index
// Import all test JSON files and export as a single array

import phq9 from './phq-9.json';
import gad7 from './gad-7.json';
import dass21 from './dass-21.json';
import bdiII from './bdi-ii.json';
import bai from './bai.json';
import pss from './pss.json';
import isi from './isi.json';
import pcl5 from './pcl-5.json';
import audit from './audit.json';
import ociR from './oci-r.json';
import ghq12 from './ghq-12.json';
import cssrs from './c-ssrs.json';
import asrs from './asrs.json';
import mdq from './mdq.json';
import eat26 from './eat-26.json';

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

// Export all test definitions
export const TEST_DEFINITIONS: TestDefinition[] = [
    // General Screening
    ghq12 as TestDefinition,

    // Depression
    phq9 as TestDefinition,
    bdiII as TestDefinition,

    // Anxiety
    gad7 as TestDefinition,
    bai as TestDefinition,

    // Stress
    pss as TestDefinition,
    dass21 as TestDefinition,

    // OCD
    ociR as TestDefinition,

    // PTSD
    pcl5 as TestDefinition,

    // Bipolar
    mdq as TestDefinition,

    // ADHD
    asrs as TestDefinition,

    // Eating Disorders
    eat26 as TestDefinition,

    // Sleep
    isi as TestDefinition,

    // Substance Use
    audit as TestDefinition,

    // Suicide / Risk
    cssrs as TestDefinition,
];

// Category definitions for UI
export const CATEGORIES = [
    { key: 'General', name: 'General Screening', nameFa: 'غربالگری عمومی', icon: '🔍' },
    { key: 'Depression', name: 'Depression', nameFa: 'افسردگی', icon: '😔' },
    { key: 'Anxiety', name: 'Anxiety', nameFa: 'اضطراب', icon: '😰' },
    { key: 'Stress', name: 'Stress', nameFa: 'استرس', icon: '😤' },
    { key: 'OCD', name: 'OCD', nameFa: 'وسواس', icon: '🔄' },
    { key: 'PTSD', name: 'PTSD / Trauma', nameFa: 'تروما و PTSD', icon: '💔' },
    { key: 'Bipolar', name: 'Bipolar / Mania', nameFa: 'دوقطبی / مانیا', icon: '🎭' },
    { key: 'ADHD', name: 'ADHD', nameFa: 'بیش‌فعالی', icon: '⚡' },
    { key: 'Eating', name: 'Eating Disorders', nameFa: 'اختلالات خوردن', icon: '🍽️' },
    { key: 'Sleep', name: 'Sleep', nameFa: 'خواب', icon: '😴' },
    { key: 'Substance', name: 'Substance Use', nameFa: 'مصرف مواد', icon: '🚬' },
    { key: 'Autism', name: 'Autism Screening', nameFa: 'اوتیسم', icon: '🧩' },
    { key: 'Suicide', name: 'Suicide / Risk', nameFa: 'خودکشی و ریسک', icon: '⚠️' },
    { key: 'Child', name: 'Child & Adolescent', nameFa: 'کودک و نوجوان', icon: '👶' },
    { key: 'QoL', name: 'Quality of Life', nameFa: 'کیفیت زندگی', icon: '✨' },
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

import { Metadata } from 'next';
import CompareClient from './CompareClient';

export const metadata: Metadata = {
    title: 'Compare Patterns — Stock Pattern Atlas',
    description: 'Select 2-3 patterns and compare their definitions, confirmation rules, traps, and best timeframes side by side.',
};

export default function ComparePage() {
    return <CompareClient />;
}

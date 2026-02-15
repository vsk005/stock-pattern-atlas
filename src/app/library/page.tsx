import { Metadata } from 'next';
import LibraryClient from './LibraryClient';

export const metadata: Metadata = {
    title: 'Pattern Library — Stock Pattern Atlas',
    description: 'Browse and search all 100 candlestick and chart patterns. Filter by category, bias, context, reliability, and timeframe.',
};

export default function LibraryPage() {
    return <LibraryClient />;
}

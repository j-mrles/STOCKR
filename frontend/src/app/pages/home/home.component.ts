import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

interface TrendSnapshot {
  symbol: string;
  company: string;
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
  score: number;
  change24h: number;
}

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly sentimentPalette: Record<TrendSnapshot['sentiment'], string> = {
    Bullish: 'var(--color-accent)',
    Neutral: '#bfbfbf',
    Bearish: '#ff6a8a'
  };

  readonly highlightStats = [
    { label: 'Trending Sentiment', value: '+12.4%', meta: 'Across watchlist today' },
    { label: 'Articles Ingested', value: '248', meta: 'Past 24 hours' },
    { label: 'AI Confidence', value: '91%', meta: 'Weighted ensemble score' }
  ];

  readonly trendSnapshots: TrendSnapshot[] = [
    {
      symbol: 'NVDA',
      company: 'NVIDIA Corp.',
      sentiment: 'Bullish',
      score: 0.82,
      change24h: 4.5
    },
    {
      symbol: 'TSLA',
      company: 'Tesla Inc.',
      sentiment: 'Neutral',
      score: 0.51,
      change24h: -1.2
    },
    {
      symbol: 'AAPL',
      company: 'Apple Inc.',
      sentiment: 'Bullish',
      score: 0.74,
      change24h: 2.1
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft Corp.',
      sentiment: 'Bearish',
      score: 0.38,
      change24h: -3.4
    }
  ];
}



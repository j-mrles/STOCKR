import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { StockService } from '../../core/stocks/stock.service';

interface TrendSnapshot {
  symbol: string;
  company: string;
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
  score: number;
  change24h: number;
  currentPrice?: number;
  priceChangePercent?: number;
}

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly stockService = inject(StockService);
  private refreshSubscription?: Subscription;
  
  readonly isModalOpen = signal(false);
  readonly modalSearchQuery = signal('');
  readonly modalSearchResults = signal<string[]>([]);
  
  readonly sentimentPalette: Record<TrendSnapshot['sentiment'], string> = {
    Bullish: 'var(--color-accent)',
    Neutral: '#bfbfbf',
    Bearish: '#ff6a8a'
  };
  
  // Available stocks for search
  private readonly availableStocks = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BRK.B', 'UNH', 'JNJ',
    'V', 'WMT', 'PG', 'JPM', 'MA', 'DIS', 'HD', 'PYPL', 'BAC', 'CMCSA',
    'NFLX', 'ADBE', 'INTC', 'PFE', 'KO', 'NKE', 'XOM', 'CSCO', 'TMO', 'COST',
    'AVGO', 'PEP', 'TMUS', 'ABBV', 'DHR', 'ABT', 'MRK', 'MCD', 'ACN', 'CRM'
  ];

  readonly highlightStats = [
    { label: 'Trending Sentiment', value: '+12.4%', meta: 'Across watchlist today' },
    { label: 'Articles Ingested', value: '248', meta: 'Past 24 hours' },
    { label: 'AI Confidence', value: '91%', meta: 'Weighted ensemble score' }
  ];

  readonly trendSnapshots = signal<TrendSnapshot[]>([
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
  ]);

  ngOnInit(): void {
    // Fetch real-time prices for all stocks in watchlist
    this.loadStockPrices();
    
    // Refresh prices every 15 seconds
    this.refreshSubscription = interval(15000).subscribe(() => {
      this.loadStockPrices();
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  private loadStockPrices(): void {
    const symbols = this.trendSnapshots().map(t => t.symbol);
    
    this.stockService.getMultipleQuotes(symbols).subscribe({
      next: (prices) => {
        const updatedSnapshots = this.trendSnapshots().map(snapshot => {
          const price = prices.find(p => p.symbol === snapshot.symbol);
          if (price) {
            return {
              ...snapshot,
              currentPrice: price.currentPrice,
              priceChangePercent: ((price.currentPrice - price.previousClose) / price.previousClose) * 100
            };
          }
          return snapshot;
        });
        this.trendSnapshots.set(updatedSnapshots);
      },
      error: (err) => {
        console.error('Failed to load stock prices:', err);
      }
    });
  }

  openConfigureModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.modalSearchQuery.set('');
    this.modalSearchResults.set([]);
  }

  onModalSearchInput(value: string): void {
    this.modalSearchQuery.set(value);
    
    if (!value || value.length < 1) {
      this.modalSearchResults.set([]);
      return;
    }

    const query = value.toUpperCase();
    const matches = this.availableStocks
      .filter(stock => stock.includes(query))
      .slice(0, 10);
    
    this.modalSearchResults.set(matches);
  }

  addStockToWatchlist(symbol: string): void {
    // Check if already exists
    const exists = this.trendSnapshots().some(t => t.symbol === symbol);
    if (exists) {
      return;
    }

    // Add with mock sentiment data (will be replaced with real data later)
    const newStock: TrendSnapshot = {
      symbol: symbol,
      company: `${symbol} Inc.`, // Placeholder company name
      sentiment: 'Neutral',
      score: 0.5,
      change24h: 0
    };

    this.trendSnapshots.update(stocks => [...stocks, newStock]);
    this.modalSearchQuery.set('');
    this.modalSearchResults.set([]);
    
    // Reload prices to get real data for the new stock
    this.loadStockPrices();
  }

  removeFromWatchlist(symbol: string): void {
    this.trendSnapshots.update(stocks => stocks.filter(s => s.symbol !== symbol));
    this.loadStockPrices();
  }
}



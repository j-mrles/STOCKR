import { NgFor, NgIf, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor, NgIf, NgClass],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = this.authService.isAuthenticated;

  readonly links = computed(() => {
    if (this.isAuthenticated()) {
      return [
        { label: 'Home', path: '/home' },
        { label: 'Analytics', path: '/analytics' },
        { label: 'News', path: '/news' },
        { label: 'Portfolio', path: '/portfolio' }
      ];
    }
    return [{ label: 'Login', path: '/login' }];
  });

  // Search functionality
  readonly searchQuery = signal('');
  readonly isSearchOpen = signal(false);
  readonly searchResults = signal<string[]>([]);

  // Mock stock database
  private readonly allStocks = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BRK.B', 'UNH', 'JNJ',
    'V', 'WMT', 'PG', 'JPM', 'MA', 'DIS', 'HD', 'PYPL', 'BAC', 'CMCSA',
    'NFLX', 'ADBE', 'INTC', 'PFE', 'KO', 'NKE', 'XOM', 'CSCO', 'TMO', 'COST',
    'AVGO', 'PEP', 'TMUS', 'ABBV', 'DHR', 'ABT', 'MRK', 'MCD', 'ACN', 'CRM'
  ];

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    
    if (!value || value.length < 1) {
      this.searchResults.set([]);
      return;
    }

    const query = value.toUpperCase();
    const matches = this.allStocks
      .filter(stock => stock.includes(query))
      .slice(0, 10); // Top 10 results
    
    this.searchResults.set(matches);
    this.isSearchOpen.set(matches.length > 0);
  }

  onSearchClick(): void {
    this.isSearchOpen.set(true);
  }

  selectStock(symbol: string): void {
    this.searchQuery.set(symbol);
    this.isSearchOpen.set(false);
    this.searchResults.set([]);
    console.log('Selected stock:', symbol);
    // TODO: Navigate to stock detail page or add to watchlist
  }

  onSearchBlur(): void {
    // Delay closing to allow for click events
    setTimeout(() => {
      this.isSearchOpen.set(false);
    }, 200);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


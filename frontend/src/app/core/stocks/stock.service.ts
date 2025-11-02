import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';

export interface StockPrice {
  symbol: string;
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  previousClose: number;
  volume: number;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getQuote(symbol: string): Observable<StockPrice> {
    const url = `${this.config.apiUrl}/api/stock/${symbol}`;
    return this.http.get<StockPrice>(url);
  }

  getMultipleQuotes(symbols: string[]): Observable<StockPrice[]> {
    const symbolsParam = symbols.join(',');
    const url = `${this.config.apiUrl}/api/stock/multiple?symbols=${symbolsParam}`;
    return this.http.get<StockPrice[]>(url);
  }
}


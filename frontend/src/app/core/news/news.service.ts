import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';

export interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  url: string;
  scraped_at: string;
}

export interface NewsResponse {
  status: string;
  count: number;
  articles: NewsArticle[];
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getLatestNews(limit: number = 20): Observable<NewsResponse> {
    const url = `${this.config.apiUrl}/api/news?limit=${limit}`;
    return this.http.get<NewsResponse>(url);
  }
}


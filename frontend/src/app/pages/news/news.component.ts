import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService, NewsArticle } from '../../core/news/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  private readonly newsService = inject(NewsService);
  
  readonly articles = signal<NewsArticle[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadNews();
  }

  private loadNews(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.newsService.getLatestNews(30).subscribe({
      next: (response) => {
        this.articles.set(response.articles);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load news:', err);
        this.error.set('Failed to load news. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  formatTimestamp(timestamp: string): string {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      }
    } catch {
      return timestamp;
    }
  }

  openArticle(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  refreshNews(): void {
    this.loadNews();
  }
}


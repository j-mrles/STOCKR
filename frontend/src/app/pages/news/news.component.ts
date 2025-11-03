import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  readonly categories = [
    {
      title: 'Market News',
      description: 'Latest stock market updates',
      icon: '📰'
    },
    {
      title: 'AI Analysis',
      description: 'AI-powered sentiment insights',
      icon: '🤖'
    },
    {
      title: 'Earnings Reports',
      description: 'Company earnings announcements',
      icon: '💰'
    }
  ];
}


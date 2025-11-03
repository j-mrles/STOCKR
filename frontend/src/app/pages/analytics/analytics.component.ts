import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent {
  readonly features = [
    {
      title: 'Sentiment Trends',
      description: 'Track sentiment changes over time',
      icon: '📊'
    },
    {
      title: 'Momentum Indicators',
      description: 'Identify emerging market patterns',
      icon: '📈'
    },
    {
      title: 'Risk Analysis',
      description: 'Assess portfolio exposure',
      icon: '⚠️'
    }
  ];
}


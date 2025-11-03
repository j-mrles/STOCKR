import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {
  readonly sections = [
    {
      title: 'My Holdings',
      description: 'View your stock positions',
      icon: '💼'
    },
    {
      title: 'Performance',
      description: 'Track your gains and losses',
      icon: '📊'
    },
    {
      title: 'Transactions',
      description: 'Buy and sell history',
      icon: '📝'
    }
  ];
}


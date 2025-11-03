import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { NewsComponent } from './pages/news/news.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'news',
    component: NewsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];



import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: (): AppConfig => ({
    apiUrl: 'http://localhost:5100'
  })
});


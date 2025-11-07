import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: (): AppConfig => {
    // Get API URL from environment or use intelligent default
    let apiUrl = 'http://localhost:5100';
    
    if (typeof window !== 'undefined') {
      // Check if we're running from a local network IP (not localhost)
      const hostname = window.location.hostname;
      
      // If accessing from a local network IP, use that IP for the API
      if (hostname !== 'localhost' && hostname !== '127.0.0.1' && 
          (hostname.startsWith('192.168.') || 
           hostname.startsWith('10.') || 
           hostname.startsWith('172.16.') ||
           hostname.startsWith('172.17.') ||
           hostname.startsWith('172.18.') ||
           hostname.startsWith('172.19.') ||
           hostname.startsWith('172.20.') ||
           hostname.startsWith('172.21.') ||
           hostname.startsWith('172.22.') ||
           hostname.startsWith('172.23.') ||
           hostname.startsWith('172.24.') ||
           hostname.startsWith('172.25.') ||
           hostname.startsWith('172.26.') ||
           hostname.startsWith('172.27.') ||
           hostname.startsWith('172.28.') ||
           hostname.startsWith('172.29.') ||
           hostname.startsWith('172.30.') ||
           hostname.startsWith('172.31.'))) {
        apiUrl = `http://${hostname}:5100`;
      }
      
      // Allow override via window variable (useful for deployment)
      const customApiUrl = (window as any).__API_URL__;
      if (customApiUrl) {
        apiUrl = customApiUrl;
      }
    }
    
    return { apiUrl };
  }
});


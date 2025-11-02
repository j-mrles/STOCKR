import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';

export interface LoginResponse {
  isAuthenticated: boolean;
  token: string | null;
  message: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly storageKey = 'stockr_token';
  
  // Signal to track authentication state
  private readonly authToken = signal<string | null>(null);

  // Computed signal for authentication status
  readonly isAuthenticated = computed(() => {
    const token = this.authToken();
    return token !== null && token.length > 0;
  });

  login(request: LoginRequest): Observable<LoginResponse> {
    const url = `${this.config.apiUrl}/api/auth/login`;
    return this.http.post<LoginResponse>(url, request);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    // Try sessionStorage first, then localStorage as fallback
    return sessionStorage.getItem(this.storageKey) || localStorage.getItem(this.storageKey);
  }

  logout(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    sessionStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKey);
    this.authToken.set(null);
  }

  setToken(token: string | null, remember: boolean): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!token) {
      sessionStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.storageKey);
      this.authToken.set(null);
      return;
    }

    if (remember) {
      localStorage.setItem(this.storageKey, token);
      sessionStorage.removeItem(this.storageKey);
    } else {
      sessionStorage.setItem(this.storageKey, token);
      localStorage.removeItem(this.storageKey);
    }
    
    this.authToken.set(token);
  }

  initializeAuth(): void {
    // Initialize auth state on app startup
    if (typeof window !== 'undefined') {
      this.authToken.set(this.getToken());
    }
  }
  
  constructor() {
    // Initialize auth on service creation
    this.initializeAuth();
  }
}


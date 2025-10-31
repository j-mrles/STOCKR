import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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

  login(request: LoginRequest): Observable<LoginResponse> {
    const url = `${this.config.apiUrl}/api/auth/login`;
    return this.http.post<LoginResponse>(url, request);
  }
}


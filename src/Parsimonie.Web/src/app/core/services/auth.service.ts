import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginResponse } from '../models/user.model';

const ACCESS_TOKEN_KEY = 'parsimonie_access_token';
const REFRESH_TOKEN_KEY = 'parsimonie_refresh_token';
const USER_KEY = 'parsimonie_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(this.loadUserFromStorage());
  
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isOfficer = computed(() => {
    const user = this.userSignal();
    return user?.roles.includes('Officer') || user?.roles.includes('GM') || false;
  });
  readonly isGM = computed(() => {
    const user = this.userSignal();
    return user?.roles.includes('GM') || false;
  });

  constructor(private router: Router) {}

  login(): void {
    // Redirect to API's Discord OAuth endpoint
    const returnUrl = encodeURIComponent(window.location.origin + '/auth/callback');
    window.location.href = `${environment.apiUrl}/auth/login?returnUrl=${returnUrl}`;
  }

  handleCallback(accessToken: string, refreshToken: string): void {
    this.storeTokens(accessToken, refreshToken);
    // User will be loaded from /api/me after redirect
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    
    // Call logout endpoint if we have a refresh token
    if (refreshToken) {
      fetch(`${environment.apiUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`
        },
        body: JSON.stringify({ refreshToken })
      }).catch(() => {
        // Ignore errors on logout
      });
    }

    this.clearAuth();
    this.router.navigate(['/login']);
  }

  setUser(user: User): void {
    this.userSignal.set(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${environment.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const data: LoginResponse = await response.json();
      this.storeTokens(data.accessToken, data.refreshToken);
      this.setUser(data.user);
      return data.accessToken;
    } catch {
      this.clearAuth();
      return null;
    }
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  private clearAuth(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
  }

  private loadUserFromStorage(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }
}

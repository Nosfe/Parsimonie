import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="min-h-screen bg-portal-black flex items-center justify-center">
      <div class="text-center">
        <!-- Loading spinner -->
        <div class="mb-6">
          <div class="w-16 h-16 border-4 border-fel-green border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        
        <h2 class="text-xl text-white mb-2">Authenticating...</h2>
        <p class="text-gray-400">Opening the Dark Portal</p>
        
        @if (error) {
          <div class="mt-6 bg-red-900/50 border border-red-500 rounded-lg p-4 max-w-md mx-auto">
            <p class="text-red-400">{{ error }}</p>
            <button 
              (click)="goToLogin()"
              class="mt-4 btn-secondary"
            >
              Return to Login
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  error: string | null = null;

  ngOnInit(): void {
    // Get tokens from query params (sent by API after Discord OAuth)
    const params = this.route.snapshot.queryParams;
    
    const accessToken = params['access_token'];
    const refreshToken = params['refresh_token'];
    const errorParam = params['error'];

    if (errorParam) {
      this.error = this.getErrorMessage(errorParam);
      return;
    }

    if (accessToken && refreshToken) {
      this.authService.handleCallback(accessToken, refreshToken);
    } else {
      this.error = 'Invalid callback - missing tokens';
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private getErrorMessage(error: string): string {
    switch (error) {
      case 'access_denied':
        return 'Access denied. You may have cancelled the login.';
      case 'invalid_guild':
        return 'You must be a member of the guild to access this application.';
      case 'invalid_role':
        return 'You must have the Raider role to access this application.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  }
}

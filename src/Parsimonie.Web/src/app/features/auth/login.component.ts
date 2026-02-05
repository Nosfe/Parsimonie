import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="min-h-screen bg-portal-black flex items-center justify-center">
      <div class="text-center">
        <!-- TBC Portal Logo/Title -->
        <div class="mb-8">
          <h1 class="text-5xl font-bold text-tbc-gold mb-2 tracking-wider">
            PARSIMONIE
          </h1>
          <p class="text-fel-green text-lg tracking-wide">
            The Burning Crusade Guild Manager
          </p>
        </div>

        <!-- Login Card -->
        <div class="bg-outland-gray border border-netherstorm rounded-lg p-8 shadow-2xl max-w-md mx-auto">
          <div class="mb-6">
            <svg class="w-16 h-16 mx-auto text-fel-green" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>

          <h2 class="text-xl text-white mb-4">Sign in with Discord</h2>
          <p class="text-gray-400 text-sm mb-6">
            Connect your Discord account to access guild features.
            <br/>
            <span class="text-fel-green">Raider role required.</span>
          </p>

          <button 
            (click)="login()"
            [disabled]="isLoading()"
            class="btn-primary w-full flex items-center justify-center gap-3 py-3 px-6 text-lg disabled:opacity-50"
          >
            @if (isLoading()) {
              <div class="w-6 h-6 border-2 border-portal-black border-t-transparent rounded-full animate-spin"></div>
              Redirecting...
            } @else {
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Continue with Discord
            }
          </button>

          <!-- Demo Mode Button -->
          <div class="mt-6 pt-6 border-t border-netherstorm">
            <p class="text-gray-500 text-xs mb-3">Preview mode (no login required)</p>
            <button 
              (click)="enterDemo()"
              class="w-full flex items-center justify-center gap-2 py-2 px-4 bg-netherstorm text-tbc-gold rounded-lg hover:bg-portal-black transition-colors border border-tbc-gold/30"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Enter Demo Mode
            </button>
          </div>
        </div>

        <!-- Footer -->
        <p class="mt-8 text-gray-600 text-sm">
          Through the Dark Portal we go...
        </p>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);

  ngOnInit(): void {
    // If already authenticated (demo mode), redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.isLoading.set(true);
    this.authService.login();
  }

  enterDemo(): void {
    // Just navigate to dashboard - demo mode auto-authenticates
    this.router.navigate(['/dashboard']);
  }
}

import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  styles: [`
    :host {
      display: block;
    }
    .home-container {
      min-height: 100vh;
      background-color: #0d0f0e;
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
    }
    /* Hero section */
    .hero-section {
      position: relative;
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .hero-glow {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(112, 192, 74, 0.1), #0d0f0e, #0d0f0e);
      pointer-events: none;
    }
    .hero-orb {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 800px;
      background: rgba(112, 192, 74, 0.05);
      border-radius: 50%;
      filter: blur(48px);
      pointer-events: none;
    }
    /* Nav */
    nav {
      position: relative;
      z-index: 10;
      border-bottom: 1px solid rgba(37, 42, 40, 0.5);
    }
    .nav-inner {
      max-width: 80rem;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 4rem;
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      background: rgba(112, 192, 74, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-icon svg {
      width: 1.5rem;
      height: 1.5rem;
      color: #70c04a;
    }
    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #d4a843;
      letter-spacing: 0.05em;
    }
    .lang-toggle {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: rgba(37, 42, 40, 0.8);
      border-radius: 0.5rem;
      padding: 0.25rem;
    }
    .lang-btn {
      padding: 0.375rem 0.75rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      background: transparent;
      color: #a0a0a0;
    }
    .lang-btn.active {
      background: #70c04a;
      color: #0d0f0e;
    }
    .lang-btn:not(.active):hover {
      color: #fff;
    }
    /* Hero content */
    .hero-content {
      position: relative;
      z-index: 10;
      max-width: 80rem;
      margin: 0 auto;
      padding: 4rem 1rem;
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 1rem;
      border-radius: 9999px;
      background: rgba(112, 192, 74, 0.1);
      border: 1px solid rgba(112, 192, 74, 0.3);
      margin: 0 auto 2rem;
    }
    .badge-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: #70c04a;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .badge-text {
      color: #70c04a;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.1;
    }
    @media (min-width: 768px) {
      .hero-title {
        font-size: 4.5rem;
      }
    }
    .hero-title-white {
      color: #fff;
    }
    .hero-title-gradient {
      background: linear-gradient(to right, #d4a843, #70c04a, #d4a843);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-subtitle {
      font-size: 1.125rem;
      color: #a0a0a0;
      max-width: 32rem;
      margin: 0 auto 2.5rem;
      line-height: 1.6;
    }
    .btn-discord {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: #5865F2;
      color: #fff;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 1.125rem;
      cursor: pointer;
      transition: all 0.2s;
      margin: 0 auto;
      text-decoration: none;
    }
    .btn-discord:hover {
      background: #4752c4;
      transform: scale(1.05);
    }
    .btn-discord svg {
      width: 1.5rem;
      height: 1.5rem;
    }
    .trust-badge {
      margin-top: 1.5rem;
      color: #a0a0a0;
      font-size: 0.875rem;
    }
    .trust-badge span {
      color: #70c04a;
    }
    /* Progress section */
    .progress-section {
      padding: 3rem 0;
      background: #1a1d1c;
      border-top: 1px solid #252a28;
    }
    .section-container {
      max-width: 48rem;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #d4a843;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .progress-bars {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .progress-item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.375rem;
    }
    .progress-label {
      color: #e8e8e8;
      font-weight: 500;
      font-size: 0.875rem;
    }
    .progress-value {
      font-weight: 600;
      font-size: 0.875rem;
    }
    .progress-value.green { color: #70c04a; }
    .progress-value.gold { color: #d4a843; }
    .progress-value.purple { color: #a855f7; }
    .progress-track {
      height: 0.5rem;
      background: #252a28;
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 9999px;
    }
    .progress-fill.tier4 { background: linear-gradient(to right, #70c04a, #d4a843); }
    .progress-fill.tier5 { background: linear-gradient(to right, #d4a843, #a855f7); }
    .progress-fill.tier6 { background: linear-gradient(to right, #a855f7, #ec4899); }
    /* Footer */
    footer {
      padding: 1.5rem 0;
      background: #0d0f0e;
      border-top: 1px solid #252a28;
    }
    .footer-inner {
      max-width: 80rem;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .footer-logo-icon {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 0.25rem;
      background: rgba(112, 192, 74, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .footer-logo-icon svg {
      width: 0.875rem;
      height: 0.875rem;
      color: #70c04a;
    }
    .footer-logo-text {
      color: #d4a843;
      font-weight: 600;
      font-size: 0.875rem;
    }
    .footer-copy {
      color: #666;
      font-size: 0.75rem;
    }
  `],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-glow"></div>
        <div class="hero-orb"></div>
        
        <!-- Nav -->
        <nav>
          <div class="nav-inner">
            <div class="logo-area">
              <div class="logo-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span class="logo-text">PARSIMONIE</span>
            </div>
            <div class="lang-toggle">
              <button class="lang-btn" [class.active]="lang() === 'fr'" (click)="setLang('fr')">FR</button>
              <button class="lang-btn" [class.active]="lang() === 'en'" (click)="setLang('en')">EN</button>
            </div>
          </div>
        </nav>

        <!-- Hero Content -->
        <div class="hero-content">
          <div class="badge">
            <span class="badge-dot"></span>
            <span class="badge-text">The Burning Crusade Classic</span>
          </div>
          
          <h1 class="hero-title">
            <span class="hero-title-white">{{ lang() === 'fr' ? 'Bienvenue sur' : 'Welcome to' }}</span><br/>
            <span class="hero-title-gradient">Parsimonie</span>
          </h1>
          
          <p class="hero-subtitle">
            {{ lang() === 'fr' 
              ? 'Gestion de guilde pour les raiders de Parsimonie. Roster, raids, présence et loot — tout au même endroit.'
              : 'Guild management for the Parsimonie raiders. Roster, raids, attendance, and loot — all in one place.' }}
          </p>
          
          <a class="btn-discord" href="https://discord.com/oauth2/authorize?client_id=1468905617761763448&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fauth%2Fcallback&scope=guilds.members.read+identify">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            {{ lang() === 'fr' ? 'Se connecter avec Discord' : 'Sign in with Discord' }}
          </a>
          
          <p class="trust-badge">
            {{ lang() === 'fr' ? 'Rôle' : 'Role' }} <span>Raider</span> {{ lang() === 'fr' ? 'requis sur le serveur Discord' : 'required on Discord server' }}
          </p>
        </div>
      </div>

      <!-- Progress Section -->
      <div class="progress-section">
        <div class="section-container">
          <h2 class="section-title">{{ lang() === 'fr' ? 'Progression du Raid' : 'Raid Progression' }}</h2>
          
          <div class="progress-bars">
            <div>
              <div class="progress-item-header">
                <span class="progress-label">Tier 4 - Karazhan / Gruul / Mag</span>
                <span class="progress-value green">8/8</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill tier4" style="width: 100%"></div>
              </div>
            </div>
            <div>
              <div class="progress-item-header">
                <span class="progress-label">Tier 5 - SSC / TK</span>
                <span class="progress-value gold">6/6</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill tier5" style="width: 100%"></div>
              </div>
            </div>
            <div>
              <div class="progress-item-header">
                <span class="progress-label">Tier 6 - Hyjal / BT</span>
                <span class="progress-value purple">5/14</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill tier6" style="width: 36%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer>
        <div class="footer-inner">
          <div class="footer-logo">
            <div class="footer-logo-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="footer-logo-text">PARSIMONIE</span>
          </div>
          <p class="footer-copy">© 2026 Parsimonie Guild</p>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent {
  lang = signal<'fr' | 'en'>('fr');
  discordOAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1468905617761763448&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fauth%2Fcallback&scope=guilds.members.read+identify';

  setLang(l: 'fr' | 'en'): void {
    this.lang.set(l);
  }
}

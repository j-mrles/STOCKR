import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = this.authService.isAuthenticated;

  readonly links = computed(() => {
    if (this.isAuthenticated()) {
      return [{ label: 'Home', path: '/home' }];
    }
    return [{ label: 'Login', path: '/login' }];
  });

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form: FormGroup = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    rememberMe: [true]
  });

  authError: string | null = null;
  isLoading = false;

  get usernameControl() {
    return this.form.get('username');
  }

  get passwordControl() {
    return this.form.get('password');
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password, rememberMe } = this.form.getRawValue();

    this.isLoading = true;
    this.authError = null;
    this.cdr.markForCheck();

    try {
      const response = await firstValueFrom(
        this.authService.login({ username, password })
      );

      if (response.isAuthenticated) {
        this.authService.setToken(response.token, rememberMe);
        await this.router.navigate(['/home']);
        return;
      }

      this.authError = response.message ?? 'Invalid username or password';
    } catch (error) {
      this.authError = 'Unable to sign in right now. Please try again later.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }
}


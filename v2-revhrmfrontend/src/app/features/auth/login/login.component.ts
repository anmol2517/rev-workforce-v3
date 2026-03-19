import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ROLES } from '../../../core/constants/api.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="login-wrapper">

      <!-- LEFT PANEL 40% -->
      <div class="login-left">
        <div class="left-content">
          <div class="brand">
            <div class="brand-icon-wrap">
              <mat-icon class="brand-icon">corporate_fare</mat-icon>
            </div>
            <h1>RevWorkforce</h1>
            <p>Human Resource Management System</p>
          </div>
          <div class="features">
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>people</mat-icon></div>
              <span>Employee Management</span>
            </div>
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>event_available</mat-icon></div>
              <span>Leave Tracking</span>
            </div>
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>star_rate</mat-icon></div>
              <span>Performance Reviews</span>
            </div>
            <div class="feature-item">
              <div class="feat-icon"><mat-icon>flag</mat-icon></div>
              <span>Goal Management</span>
            </div>
          </div>
        </div>
        <div class="left-footer">© 2026 RevWorkforce. All rights reserved.</div>
      </div>

      <!-- RIGHT PANEL 60% -->
      <div class="login-right">
        <div class="login-box">
          <div class="login-header">
            <div class="lock-wrap">
              <mat-icon class="lock-icon">lock_person</mat-icon>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="field-wrap">
              <label>Email Address</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput type="email" formControlName="email"
                  placeholder="you@revworkforce.com" autocomplete="email">
                <mat-icon matPrefix>email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Enter a valid email</mat-error>
              </mat-form-field>
            </div>

            <div class="field-wrap">
              <label>Password</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput [type]="hidePassword ? 'password' : 'text'"
                  formControlName="password" autocomplete="current-password">
                <mat-icon matPrefix>lock</mat-icon>
                <button mat-icon-button matSuffix type="button"
                  (click)="hidePassword = !hidePassword">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
              </mat-form-field>
            </div>

            <button class="login-btn" type="submit"
              [disabled]="loginForm.invalid || loading">
              <mat-spinner diameter="20" *ngIf="loading" style="display:inline-block"></mat-spinner>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }

    .login-wrapper {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* ── LEFT 40% ─────────────────────────────── */
    .login-left {
      width: 40%;
      background: linear-gradient(160deg, #0d2b2b 0%, #0e3d3d 40%, #0a4a4a 70%, #0d5555 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px 44px;
      position: relative;
      overflow: hidden;
    }

    .login-left::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 320px; height: 320px;
      border-radius: 50%;
      background: rgba(32, 178, 170, 0.08);
    }

    .login-left::after {
      content: '';
      position: absolute;
      bottom: -60px; left: -60px;
      width: 240px; height: 240px;
      border-radius: 50%;
      background: rgba(32, 178, 170, 0.06);
    }

    .left-content { position: relative; z-index: 1; }

    .brand { margin-bottom: 56px; }

    .brand-icon-wrap {
      width: 60px; height: 60px;
      border-radius: 16px;
      background: rgba(32, 178, 170, 0.2);
      border: 1px solid rgba(32, 178, 170, 0.4);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
    }

    .brand-icon {
      font-size: 32px; width: 32px; height: 32px;
      color: #20b2aa;
    }

    .brand h1 {
      font-size: 28px; font-weight: 700;
      color: #ffffff; margin-bottom: 8px; letter-spacing: -0.5px;
    }

    .brand p {
      font-size: 13px; color: rgba(255,255,255,0.5);
      letter-spacing: 0.3px;
    }

    .features { display: flex; flex-direction: column; gap: 18px; }

    .feature-item {
      display: flex; align-items: center; gap: 14px;
      color: rgba(255,255,255,0.75); font-size: 14px;
    }

    .feat-icon {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: rgba(32, 178, 170, 0.15);
      border: 1px solid rgba(32, 178, 170, 0.25);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .feat-icon mat-icon {
      font-size: 18px; width: 18px; height: 18px;
      color: #20b2aa;
    }

    .left-footer {
      font-size: 12px;
      color: rgba(255,255,255,0.25);
      position: relative; z-index: 1;
    }

    /* ── RIGHT 60% ─────────────────────────────── */
    .login-right {
      width: 60%;
      background: #1a1f2e;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .login-box {
      width: 100%;
      max-width: 440px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 36px;
    }

    .lock-wrap {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: rgba(32, 178, 170, 0.12);
      border: 2px solid rgba(32, 178, 170, 0.3);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }

    .lock-icon {
      font-size: 30px; width: 30px; height: 30px;
      color: #20b2aa;
    }

    .login-header h2 {
      font-size: 26px; font-weight: 700;
      color: #ffffff; margin-bottom: 8px;
    }

    .login-header p {
      font-size: 13px;
      color: rgba(255,255,255,0.4);
    }

    .field-wrap {
      margin-bottom: 8px;
    }

    .field-wrap label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255,255,255,0.6);
      margin-bottom: 6px;
    }

    /* Override Angular Material for dark theme */
    .full-width { width: 100%; }

    ::ng-deep .login-right .mat-mdc-form-field {
      --mdc-outlined-text-field-outline-color: rgba(255,255,255,0.15);
      --mdc-outlined-text-field-hover-outline-color: rgba(32,178,170,0.5);
      --mdc-outlined-text-field-focus-outline-color: #20b2aa;
      --mdc-outlined-text-field-input-text-color: #ffffff;
      --mdc-outlined-text-field-label-text-color: rgba(255,255,255,0.4);
      --mdc-outlined-text-field-container-shape: 10px;
    }

    ::ng-deep .login-right .mat-mdc-text-field-wrapper {
      background: rgba(255,255,255,0.04) !important;
    }

    ::ng-deep .login-right .mat-icon { color: rgba(255,255,255,0.35) !important; }
    ::ng-deep .login-right .mat-mdc-input-element { color: #fff !important; }

    .login-btn {
      width: 100%;
      height: 50px;
      background: linear-gradient(135deg, #0a4a4a 0%, #20b2aa 100%);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.5px;
      cursor: pointer;
      margin-top: 8px;
      transition: opacity 0.2s, transform 0.1s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .login-btn:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .login-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .login-left { display: none; }
      .login-right { width: 100%; background: #1a1f2e; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.loading = false;
        const role = res.role;
        if (role === 'ADMIN' || role === 'ROLE_ADMIN') 
          this.router.navigate(['/admin/dashboard']);
        else if (role === 'MANAGER' || role === 'ROLE_MANAGER') 
          this.router.navigate(['/manager/dashboard']);
        else 
          this.router.navigate(['/employee/dashboard']);
        },
      error: () => {
        this.loading = false;
        this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
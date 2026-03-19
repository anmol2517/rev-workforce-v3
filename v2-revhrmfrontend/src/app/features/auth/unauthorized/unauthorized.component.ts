import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div style="display:flex;flex-direction:column;align-items:center;
      justify-content:center;min-height:100vh;text-align:center;background:#f0f2f5">
      <mat-icon style="font-size:80px;width:80px;height:80px;color:#e53935;display:block;margin-bottom:16px">
        block
      </mat-icon>
      <h1 style="font-size:28px;font-weight:700;color:#1a1a2e;margin-bottom:8px">Access Denied</h1>
      <p style="color:#888;margin-bottom:24px">You don't have permission to access this page.</p>
      <button mat-flat-button color="primary" (click)="goBack()">Go to Login</button>
    </div>
  `
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}
  goBack(): void { this.router.navigate(['/login']); }
}
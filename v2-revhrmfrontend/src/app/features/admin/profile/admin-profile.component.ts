import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>My Profile</h1></div>
      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>
      <div *ngIf="!loading" style="display:grid;grid-template-columns:320px 1fr;gap:24px">
        <div class="card" style="text-align:center">
          <div style="width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,#1a237e,#3949ab);
            color:#fff;font-size:36px;font-weight:700;display:flex;align-items:center;
            justify-content:center;margin:0 auto 16px">
            A
          </div>
          <h2 style="font-size:20px;font-weight:700;color:#1a1a2e;margin-bottom:4px">System Admin</h2>
          <p style="color:#888;font-size:13px;margin-bottom:12px">{{ email }}</p>
          <span class="status-chip APPROVED">staus</span>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #f0f0f0;text-align:left">
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:14px;margin:10px 0">
              <mat-icon style="font-size:18px;width:18px;height:18px">admin_panel_settings</mat-icon>
              Role: ADMIN
            </p>
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:14px;margin:10px 0">
              <mat-icon style="font-size:18px;width:18px;height:18px">email</mat-icon>
              {{ email }}
            </p>
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:14px;margin:10px 0">
              <mat-icon style="font-size:18px;width:18px;height:18px">shield</mat-icon>
              Full System Access
            </p>
          </div>
        </div>
        <div class="card">
          <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:20px">System Overview</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon" style="background:linear-gradient(135deg,#1a237e,#3949ab)">
                <mat-icon>people</mat-icon>
              </div>
              <div>
                <div class="stat-value">{{ stats?.totalEmployees || 0 }}</div>
                <div class="stat-label">Employees</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:linear-gradient(135deg,#1b5e20,#388e3c)">
                <mat-icon>business</mat-icon>
              </div>
              <div>
                <div class="stat-value">{{ stats?.totalDepts || 0 }}</div>
                <div class="stat-label">Departments</div>
              </div>
            </div>
          </div>
          <div style="margin-top:20px;padding:16px;background:#f8f9fa;border-radius:10px">
            <p style="color:#888;font-size:13px;margin-bottom:4px">Admin Privileges</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
              <span style="background:#e8eaf6;color:#1a237e;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500">
                Employee Management
              </span>
              <span style="background:#e8eaf6;color:#1a237e;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500">
                Leave Management
              </span>
              <span style="background:#e8eaf6;color:#1a237e;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500">
                Reports & Analytics
              </span>
              <span style="background:#e8eaf6;color:#1a237e;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500">
                System Configuration
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminProfileComponent implements OnInit {
  loading = true;
  stats: any;
  email = '';

  constructor(private adminService: AdminService, private authService: AuthService) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    this.email = this.authService.getUserEmail() || '';
    this.adminService.getDashboardStats().subscribe({
      next: d => { this.stats = d; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
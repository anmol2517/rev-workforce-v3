import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule, RouterLink,
    MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule,
    MatButtonModule, MatMenuModule, MatDividerModule, MatBadgeModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav employee-sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">corporate_fare</mat-icon>
          <div>
            <div class="logo-title">RevWorkforce : Employee Portal</div>
          </div>
        </div>
        <mat-divider></mat-divider>
        <mat-nav-list class="nav-list">
          <a mat-list-item routerLink="/employee/dashboard" RouterLinkActive="staus-link" (click)="go('/employee/dashboard', $event)">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/employee/profile" RouterLinkActive="staus-link" (click)="go('/employee/profile', $event)">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>My Profile</span>
          </a>
          <a mat-list-item routerLink="/employee/leaves" RouterLinkActive="staus-link" (click)="go('/employee/leaves', $event)">
            <mat-icon matListItemIcon>event_busy</mat-icon>
            <span matListItemTitle>My Leaves</span>
          </a>
          <a mat-list-item routerLink="/employee/performance-reviews" RouterLinkActive="staus-link" (click)="go('/employee/performance-reviews', $event)">
            <mat-icon matListItemIcon>star_rate</mat-icon>
            <span matListItemTitle>Performance</span>
          </a>
          <a mat-list-item routerLink="/employee/goals" RouterLinkActive="staus-link" (click)="go('/employee/goals', $event)">
            <mat-icon matListItemIcon>flag</mat-icon>
            <span matListItemTitle>My Goals</span>
          </a>
          <a mat-list-item routerLink="/employee/announcements" RouterLinkActive="staus-link" (click)="go('/employee/announcements', $event)">
            <mat-icon matListItemIcon>campaign</mat-icon>
            <span matListItemTitle>Announcements</span>
          </a>
          <a mat-list-item routerLink="/employee/directory" RouterLinkActive="staus-link" (click)="go('/employee/directory', $event)">
            <mat-icon matListItemIcon>contacts</mat-icon>
            <span matListItemTitle>Directory</span>
          </a>
          <a mat-list-item routerLink="/employee/notifications" RouterLinkActive="staus-link" (click)="go('/employee/notifications', $event)">
            <mat-icon matListItemIcon
              [matBadge]="unreadCount > 0 ? unreadCount : null"
              matBadgeColor="warn"
              matBadgeSize="small">
              notifications
            </mat-icon>
            <span matListItemTitle>Notifications</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <mat-toolbar class="topbar">
          <span class="toolbar-spacer"></span>
          <button mat-icon-button (click)="go('/employee/notifications', $event)" style="margin-right:4px">
            <mat-icon
              [matBadge]="unreadCount > 0 ? unreadCount : null"
              matBadgeColor="warn"
              matBadgeSize="small"
              style="color:#555">
              notifications
            </mat-icon>
          </button>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <div class="avatar" style="background:#4a148c;color:#fff;font-size:14px;font-weight:700">
              {{ empInitials }}
            </div>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item disabled>
              <mat-icon>person</mat-icon> {{ empName || 'Employee' }}
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="go('/employee/profile', $event)">
              <mat-icon>manage_accounts</mat-icon> My Profile
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon> Logout
            </button>
          </mat-menu>
        </mat-toolbar>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    ::ng-deep .employee-sidenav { background: #4a148c !important; }
    ::ng-deep .employee-sidenav .logo-icon { color: #ce93d8 !important; }
    ::ng-deep .employee-sidenav .logo-title { color: #fff !important; }
    ::ng-deep .employee-sidenav .logo-sub { color: rgba(255,255,255,0.5) !important; font-size:11px; }
    ::ng-deep .employee-sidenav mat-divider { border-color: rgba(255,255,255,0.15) !important; }
    ::ng-deep .employee-sidenav .nav-list .mdc-list-item__primary-text { color: rgba(255,255,255,0.85) !important; }
    ::ng-deep .employee-sidenav .nav-list .mat-mdc-list-item { color: rgba(255,255,255,0.85) !important; }
    ::ng-deep .employee-sidenav .nav-list a { color: rgba(255,255,255,0.85) !important; }
    ::ng-deep .employee-sidenav .nav-list a:hover { background: rgba(255,255,255,0.1) !important; }
    ::ng-deep .employee-sidenav .nav-list a.status-link { background: rgba(255,255,255,0.18) !important; }
    ::ng-deep .employee-sidenav .nav-list mat-icon { color: rgba(255,255,255,0.8) !important; }
    ::ng-deep .employee-sidenav .nav-list a.status-link mat-icon { color: #ce93d8 !important; }
    ::ng-deep .employee-sidenav .nav-list a.status-link .mdc-list-item__primary-text { color: #fff !important; font-weight:600 !important; }
  `]
})
export class EmployeeLayoutComponent implements OnInit, OnDestroy {
  unreadCount = 0;
  empName = '';
  empInitials = 'E';
  private pollInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeService.getProfile().subscribe({
      next: (d: any) => {
        const p = d;
        this.empName = `${p?.firstName||''} ${p?.lastName||''}`.trim();
        this.empInitials = `${p?.firstName?.charAt(0)||''}${p?.lastName?.charAt(0)||''}`.toUpperCase() || 'E';
      },
      error: () => {}
    });
    this.loadUnreadCount();
    this.pollInterval = setInterval(() => this.loadUnreadCount(), 30000);
  }

  loadUnreadCount(): void {
    this.employeeService.getUnreadCount().subscribe({
      next: (d: any) => {
        const v = d;
        this.unreadCount = typeof v === 'number' ? v : (v?.count || 0);
      },
      error: () => {}
    });
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  go(path: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([path]);
  }

  logout(): void { this.authService.logout(); }
}
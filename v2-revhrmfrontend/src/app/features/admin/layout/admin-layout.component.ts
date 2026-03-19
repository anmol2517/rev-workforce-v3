import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule, RouterLink,
    MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule,
    MatButtonModule, MatMenuModule, MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav admin-sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">corporate_fare</mat-icon>
          <div>
            <div class="logo-title">RevWorkforce : Admin Panel</div>
          </div>
        </div>
        <mat-divider></mat-divider>
        <mat-nav-list class="nav-list">
          <a mat-list-item routerLink="/admin/dashboard" RouterLinkActive="staus-link" (click)="go('/admin/dashboard', $event)">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/admin/employees" RouterLinkActive="staus-link" (click)="go('/admin/employees', $event)">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Employees</span>
          </a>
          <a mat-list-item routerLink="/admin/departments" RouterLinkActive="staus-link" (click)="go('/admin/departments', $event)">
            <mat-icon matListItemIcon>business</mat-icon>
            <span matListItemTitle>Departments</span>
          </a>
          <a mat-list-item routerLink="/admin/designations" RouterLinkActive="staus-link" (click)="go('/admin/designations', $event)">
            <mat-icon matListItemIcon>badge</mat-icon>
            <span matListItemTitle>Designations</span>
          </a>
          <a mat-list-item routerLink="/admin/leaves" RouterLinkActive="staus-link" (click)="go('/admin/leaves', $event)">
            <mat-icon matListItemIcon>event_busy</mat-icon>
            <span matListItemTitle>Leave Management</span>
          </a>
          <a mat-list-item routerLink="/admin/holidays" RouterLinkActive="staus-link" (click)="go('/admin/holidays', $event)">
            <mat-icon matListItemIcon>celebration</mat-icon>
            <span matListItemTitle>Holidays</span>
          </a>
          <a mat-list-item routerLink="/admin/announcements" RouterLinkActive="staus-link" (click)="go('/admin/announcements', $event)">
            <mat-icon matListItemIcon>campaign</mat-icon>
            <span matListItemTitle>Announcements</span>
          </a>
          <a mat-list-item routerLink="/admin/view-profile" RouterLinkActive="staus-link" (click)="go('/admin/view-profile', $event)">
            <mat-icon matListItemIcon>manage_search</mat-icon>
            <span matListItemTitle>Search Profile</span>
          </a>
          <a mat-list-item routerLink="/admin/left-employees" RouterLinkActive="staus-link" (click)="go('/admin/left-employees', $event)">
            <mat-icon matListItemIcon>person_off</mat-icon>
            <span matListItemTitle>Left Employees</span>
          </a>
          <a mat-list-item routerLink="/admin/goals" RouterLinkActive="staus-link" (click)="go('/admin/goals', $event)">
            <mat-icon matListItemIcon>flag</mat-icon>
            <span matListItemTitle>Goals</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="main-content">
        <mat-toolbar class="topbar">
          <span class="toolbar-spacer"></span>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <div class="avatar" style="background:#1a237e;color:#fff">A</div>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="go('/admin/profile', $event)">
              <mat-icon>person</mat-icon> My Profile
            </button>
            <mat-divider></mat-divider>
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
    .admin-sidenav {
      background-image: linear-gradient(135deg, rgb(31, 31, 44) 0%, rgb(37, 53, 155) 100%);
    }
    .admin-sidenav .logo-icon { color: #90caf9; }
    .admin-sidenav .logo-title { color: #fff; }
    .admin-sidenav mat-divider { border-color: rgba(255,255,255,0.15) !important; }
    ::ng-deep .admin-sidenav .nav-list .mdc-list-item__primary-text { color: rgba(255,255,255,0.95) !important; }
    ::ng-deep .admin-sidenav .nav-list .mat-mdc-list-item .mat-icon { color: rgba(255,255,255,0.8) !important; }
    ::ng-deep .admin-sidenav .nav-list .mat-mdc-list-item:hover .mdc-list-item__primary-text { color: #fff !important; }
    ::ng-deep .admin-sidenav .nav-list .mat-mdc-list-item:hover { background: rgba(255,255,255,0.15) !important; }
    ::ng-deep .admin-sidenav .nav-list .status-link .mdc-list-item__primary-text { color: #fff !important; }
    ::ng-deep .admin-sidenav .nav-list .status-link { background: rgba(255,255,255,0.20) !important; }
    ::ng-deep .admin-sidenav .nav-list .status-link .mat-icon { color: #90caf9 !important; }
  `]
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  go(path: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([path]);
  }

  logout(): void { this.authService.logout(); }
}
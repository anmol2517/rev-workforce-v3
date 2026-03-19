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
  selector: 'app-manager-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav manager-sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">corporate_fare</mat-icon>
          <div>
            <div class="logo-title">RevWorkforce : Manager Panel</div>
          </div>
        </div>
        <mat-divider></mat-divider>

        <mat-nav-list class="nav-list">
          
          <a mat-list-item
             routerLink="/manager/dashboard"
             routerLinkActive="status-link"
             (click)="go('/manager/dashboard', $event)">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>

          <a mat-list-item
             routerLink="/manager/team"
             routerLinkActive="status-link"
             (click)="go('/manager/team', $event)">
            <mat-icon matListItemIcon>group</mat-icon>
            <span matListItemTitle>My Team</span>
          </a>

          <a mat-list-item
             routerLink="/manager/leaves"
             routerLinkActive="status-link"
             (click)="go('/manager/leaves', $event)">
            <mat-icon matListItemIcon>event_busy</mat-icon>
            <span matListItemTitle>Leave Requests</span>
          </a>

          <a mat-list-item
             routerLink="/manager/performance-reviews"
             routerLinkActive="status-link"
             (click)="go('/manager/performance-reviews', $event)">
            <mat-icon matListItemIcon>star_rate</mat-icon>
            <span matListItemTitle>Performance Reviews</span>
          </a>

          <a mat-list-item
             routerLink="/manager/goals"
             routerLinkActive="status-link"
             (click)="go('/manager/goals', $event)">
            <mat-icon matListItemIcon>flag</mat-icon>
            <span matListItemTitle>Goals</span>
          </a>

          <a mat-list-item
             routerLink="/manager/announcements"
             routerLinkActive="status-link"
             (click)="go('/manager/announcements', $event)">
            <mat-icon matListItemIcon>campaign</mat-icon>
            <span matListItemTitle>Announcements</span>
          </a>

          <a mat-list-item
             routerLink="/manager/holidays"
             routerLinkActive="status-link"
             (click)="go('/manager/holidays', $event)">
            <mat-icon matListItemIcon>celebration</mat-icon>
            <span matListItemTitle>Holidays</span>
          </a>

          <a mat-list-item
             routerLink="/manager/notifications"
             routerLinkActive="status-link"
             (click)="go('/manager/notifications', $event)">
            <mat-icon matListItemIcon>notifications</mat-icon>
            <span matListItemTitle>Notifications</span>
          </a>

          <a mat-list-item
             routerLink="/manager/profile"
             routerLinkActive="status-link"
             (click)="go('/manager/profile', $event)">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>My Profile</span>
          </a>

        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <mat-toolbar class="topbar">
          <span class="toolbar-spacer"></span>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <div class="avatar" style="background:#1b5e20;color:#fff">M</div>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item disabled><mat-icon>manage_accounts</mat-icon> Manager</button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()"><mat-icon>logout</mat-icon> Logout</button>
          </mat-menu>
        </mat-toolbar>

        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .manager-sidenav {
        background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
      }
      .manager-sidenav .logo-icon {
        color: #a5d6a7;
      }
      .manager-sidenav .logo-title {
        color: #fff;
      }
      .manager-sidenav mat-divider {
        border-color: rgba(255, 255, 255, 0.15) !important;
      }
      ::ng-deep .manager-sidenav .nav-list .mdc-list-item__primary-text {
        color: rgba(255, 255, 255, 0.95) !important;
      }
      ::ng-deep .manager-sidenav .nav-list .mat-mdc-list-item .mat-icon {
        color: rgba(255, 255, 255, 0.8) !important;
      }
      ::ng-deep .manager-sidenav .nav-list .mat-mdc-list-item:hover {
        background: rgba(255, 255, 255, 0.12) !important;
      }
      ::ng-deep .manager-sidenav .nav-list .status-link {
        background: rgba(255, 255, 255, 0.2) !important;
      }
      ::ng-deep .manager-sidenav .nav-list .status-link .mdc-list-item__primary-text {
        color: #fff !important;
      }
      ::ng-deep .manager-sidenav .nav-list .status-link .mat-icon {
        color: #a5d6a7 !important;
      }
    `,
  ],
})
export class ManagerLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  go(path: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManagerService } from '../../../core/services/manager.service';
import { Goal } from '../../../core/models/models';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <!-- Welcome Banner -->
      <div class="card" style="background:linear-gradient(135deg,#1b5e20,#2e7d32);color:#fff;padding:28px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
        <div>
          <h1 style="font-size:22px;font-weight:700;margin-bottom:6px">Welcome, {{ managerName }} 👋</h1>
          <p style="color:rgba(255,255,255,0.75);font-size:14px">{{ today | date:'EEEE, MMMM d, y' }} — Here's your team overview</p>
        </div>
        <div style="text-align:right">
          <mat-icon style="font-size:24px;width:24px;height:24px;color:#a5d6a7;display:block;margin-bottom:4px;margin-left:auto">format_quote</mat-icon>
          <p style="font-size:13px;font-style:italic;color:rgba(255,255,255,0.85);margin-bottom:2px">"{{ quote.text }}"</p>
          <p style="font-size:11px;color:rgba(255,255,255,0.5)">— {{ quote.author }}</p>
        </div>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
        <div class="card" style="padding:20px;cursor:pointer" (click)="nav('/manager/team')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p style="font-size:12px;color:#888;font-weight:600;text-transform:uppercase;margin-bottom:8px">Team Size</p>
              <h2 style="font-size:32px;font-weight:800;color:#1a237e">{{ stats.teamSize || 0 }}</h2>
            </div>
            <div style="width:44px;height:44px;border-radius:12px;background:#e8eaf6;display:flex;align-items:center;justify-content:center">
              <mat-icon style="color:#3949ab">group</mat-icon>
            </div>
          </div>
        </div>

        <div class="card" style="padding:20px;cursor:pointer" (click)="nav('/manager/leaves')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p style="font-size:12px;color:#888;font-weight:600;text-transform:uppercase;margin-bottom:8px">Pending Leaves</p>
              <h2 style="font-size:32px;font-weight:800;color:#f57f17">{{ stats.pendingLeaves || 0 }}</h2>
            </div>
            <div style="width:44px;height:44px;border-radius:12px;background:#fff8e1;display:flex;align-items:center;justify-content:center">
              <mat-icon style="color:#f9a825">event_busy</mat-icon>
            </div>
          </div>
        </div>

        <!-- Team Goals — from goals API directly, always accurate -->
        <div class="card" style="padding:20px;cursor:pointer" (click)="nav('/manager/goals')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p style="font-size:12px;color:#888;font-weight:600;text-transform:uppercase;margin-bottom:8px">Team Goals</p>
              <h2 style="font-size:32px;font-weight:800;color:#2e7d32">{{ allGoals.length }}</h2>
            </div>
            <div style="width:44px;height:44px;border-radius:12px;background:#e8f5e9;display:flex;align-items:center;justify-content:center">
              <mat-icon style="color:#388e3c">flag</mat-icon>
            </div>
          </div>
        </div>

        <!-- Pending Reviews — from reviews API, SUBMITTED + UNDER_REVIEW -->
        <div class="card" style="padding:20px;cursor:pointer" (click)="nav('/manager/performance-reviews')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p style="font-size:12px;color:#888;font-weight:600;text-transform:uppercase;margin-bottom:8px">Pending Reviews</p>
              <h2 style="font-size:32px;font-weight:800;color:#6a1b9a">{{ pendingReviewCount }}</h2>
            </div>
            <div style="width:44px;height:44px;border-radius:12px;background:#f3e5f5;display:flex;align-items:center;justify-content:center">
              <mat-icon style="color:#7b1fa2">star_rate</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card" style="padding:24px;margin-bottom:24px">
        <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:16px">Quick Actions</h3>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px">
          <button mat-flat-button (click)="nav('/manager/team')"
            style="background:#e8eaf6;color:#1a237e;display:flex;align-items:center;justify-content:center;gap:6px;padding:14px 0">
            <mat-icon>group</mat-icon> View Team
          </button>
          <button mat-flat-button (click)="nav('/manager/leaves')"
            style="background:#fff8e1;color:#f57f17;display:flex;align-items:center;justify-content:center;gap:6px;padding:14px 0">
            <mat-icon>event_busy</mat-icon> Leave Requests
          </button>
          <button mat-flat-button (click)="nav('/manager/goals')"
            style="background:#e8f5e9;color:#2e7d32;display:flex;align-items:center;justify-content:center;gap:6px;padding:14px 0">
            <mat-icon>flag</mat-icon> Team Goals
          </button>
          <button mat-flat-button (click)="nav('/manager/performance-reviews')"
            style="background:#f3e5f5;color:#6a1b9a;display:flex;align-items:center;justify-content:center;gap:6px;padding:14px 0">
            <mat-icon>star_rate</mat-icon> Reviews
          </button>
          <button mat-flat-button (click)="nav('/manager/announcements')"
            style="background:#e0f2f1;color:#00695c;display:flex;align-items:center;justify-content:center;gap:6px;padding:14px 0">
            <mat-icon>campaign</mat-icon> Announcements
          </button>
        </div>
      </div>

      <!-- Goals Overview + Leave Summary -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <div class="card" style="padding:24px">
          <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:16px">Goals Status</h3>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#e8f5e9;border-radius:8px">
              <span style="font-size:13px;color:#2e7d32;font-weight:600">✅ Completed</span>
              <span style="font-weight:800;color:#2e7d32">{{ countGoals('COMPLETED') }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#fff8e1;border-radius:8px">
              <span style="font-size:13px;color:#f57f17;font-weight:600">🔄 In Progress</span>
              <span style="font-weight:800;color:#f57f17">{{ countGoals('IN_PROGRESS') }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#fce4ec;border-radius:8px">
              <span style="font-size:13px;color:#c62828;font-weight:600">⏸ Not Started</span>
              <span style="font-weight:800;color:#c62828">{{ countGoals('NOT_STARTED') }}</span>
            </div>
          </div>
        </div>

        <div class="card" style="padding:24px">
          <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:16px">Leave Summary</h3>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#fff8e1;border-radius:8px">
              <span style="font-size:13px;color:#f57f17;font-weight:600">⏳ Pending</span>
              <span style="font-weight:800;color:#f57f17">{{ stats.pendingLeaves || 0 }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#e8f5e9;border-radius:8px">
              <span style="font-size:13px;color:#2e7d32;font-weight:600">✅ Approved</span>
              <span style="font-weight:800;color:#2e7d32">{{ stats.approvedLeaves || 0 }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#fce4ec;border-radius:8px">
              <span style="font-size:13px;color:#c62828;font-weight:600">❌ Rejected</span>
              <span style="font-weight:800;color:#c62828">{{ stats.rejectedLeaves || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ManagerDashboardComponent implements OnInit {
  stats: any = {};
  allGoals: Goal[] = [];
  allReviews: any[] = [];
  loading = true;
  today = new Date();
  managerName = '';

  quotes = [
    { text: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।', author: 'Bhagavad Gita 2.48' },
    { text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।', author: 'Bhagavad Gita 2.47' },
    { text: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।', author: 'Bhagavad Gita 3.35' },
    { text: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।', author: 'Bhagavad Gita 6.5' },
    { text: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।', author: 'Bhagavad Gita 18.66' },
  ];
  quote = this.quotes[new Date().getDay() % this.quotes.length];

  constructor(private managerService: ManagerService, private router: Router) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    // Manager name
    this.managerService.getProfile().subscribe({
      next: (d: any) => {
        const profile = d;
        this.managerName = profile?.firstName || 'Manager';
      },
      error: () => {},
    });

    // Build stats from real API calls
    this.managerService.getTeamMembers().subscribe({
      next: (d: any) => {
        const team = Array.isArray(d) ? d : [];
        this.stats = { ...this.stats, teamSize: team.length };
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
    this.managerService.getTeamLeaves().subscribe({
      next: (d: any) => {
        const leaves = Array.isArray(d) ? d : (d?.content || d?.data?.content || []);
        this.stats = {
          ...this.stats,
          pendingLeaves: leaves.filter((l: any) => l.status === 'PENDING').length,
          approvedLeaves: leaves.filter((l: any) => l.status === 'APPROVED').length,
          rejectedLeaves: leaves.filter((l: any) => l.status === 'REJECTED').length,
        };
      },
      error: () => {},
    });

    // Goals — separate call so count is always real
    this.managerService.getTeamGoals().subscribe({
      next: (d: any) => { this.allGoals = Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []); },
      error: () => {},
    });

    // Reviews — separate call so pending count is real
    this.managerService.getTeamReviews().subscribe({
      next: (d: any) => { this.allReviews = Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []); },
      error: () => {},
    });
  }

  countGoals(status: string): number {
    return this.allGoals.filter(g => g.status === status).length;
  }

  get pendingReviewCount(): number {
    return this.allReviews.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  }

  nav(path: string): void { this.router.navigate([path]); }
}
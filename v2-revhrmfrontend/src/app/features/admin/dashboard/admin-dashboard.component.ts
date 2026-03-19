import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page-container">
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div>
          <h1>Welcome back, Admin 👋</h1>
          <p>{{ today | date: 'EEEE, MMMM d, y' }} — Here's what's happening at RevWorkforce</p>
        </div>
        <div style="text-align:right;max-width:340px">
          <mat-icon
            style="font-size:24px;width:24px;height:24px;color:#90caf9;display:block;margin-bottom:6px;margin-left:auto"
            >format_quote</mat-icon
          >
          <p
            style="font-size:13px;font-style:italic;color:rgba(255,255,255,0.85);margin-bottom:4px"
          >
            "{{ quote.text }}"
          </p>
          <p style="font-size:11px;color:rgba(255,255,255,0.5)">— {{ quote.author }}</p>
        </div>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <ng-container *ngIf="!loading">
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card" (click)="nav('/admin/employees')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#1a237e,#3949ab)">
              <mat-icon>people</mat-icon>
            </div>
            <div>
              <div class="stat-value">{{ stats?.totalEmployees || 0 }}</div>
              <div class="stat-label">Total Employees</div>
            </div>
          </div>
          <div class="stat-card" (click)="nav('/admin/departments')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#1b5e20,#388e3c)">
              <mat-icon>business</mat-icon>
            </div>
            <div>
              <div class="stat-value">{{ stats?.totalDepartments || 0 }}</div>
              <div class="stat-label">Departments</div>
            </div>
          </div>
          <div class="stat-card" (click)="nav('/admin/designations')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#004d40,#00796b)">
              <mat-icon>badge</mat-icon>
            </div>
            <div>
              <div class="stat-value">{{ designationsCount }}</div>
              <div class="stat-label">Designations</div>
            </div>
          </div>
          <div class="stat-card" (click)="nav('/admin/announcements')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#4a148c,#7b1fa2)">
              <mat-icon>campaign</mat-icon>
            </div>
            <div>
              <div class="stat-value">
                {{ stats?.totalAnnouncementsActive || announcementsCount }}
              </div>
              <div class="stat-label">Active Announcements</div>
            </div>
          </div>
          <div class="stat-card" (click)="nav('/admin/goals')" style="cursor:pointer">
            <div class="stat-icon" style="background:linear-gradient(135deg,#006064,#00838f)">
              <mat-icon>flag</mat-icon>
            </div>
            <div>
              <div class="stat-value">
                {{
                  (stats?.goalStats?.inProgress || 0) +
                    (stats?.goalStats?.notStarted || 0) +
                    (stats?.goalStats?.completed || 0)
                }}
              </div>
              <div class="stat-label">Total Goals</div>
            </div>
          </div>
        </div>

        <!-- Leave Overview + Quick Actions -->
        <div style="display:grid;grid-template-columns:1fr 340px;gap:20px;margin-bottom:20px">
          <div class="card">
            <h3 style="margin-bottom:20px;font-weight:700;color:#1a1a2e;font-size:16px">
              📊 Leave Overview
            </h3>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
              <div
                (click)="nav('/admin/leaves')"
                style="text-align:center;padding:24px 16px;background:linear-gradient(135deg,#e8f5e9,#c8e6c9);border-radius:12px;cursor:pointer"
              >
                <div style="font-size:36px;font-weight:800;color:#2e7d32">
                  {{ stats?.approvedLeaves || 0 }}
                </div>
                <div style="color:#388e3c;font-size:13px;font-weight:600;margin-top:4px">
                  ✅ Approved
                </div>
              </div>
              <div
                (click)="nav('/admin/leaves')"
                style="text-align:center;padding:24px 16px;background:linear-gradient(135deg,#fff8e1,#ffecb3);border-radius:12px;cursor:pointer"
              >
                <div style="font-size:36px;font-weight:800;color:#f57f17">
                  {{ stats?.pendingLeaveRequests || 0 }}
                </div>
                <div style="color:#f9a825;font-size:13px;font-weight:600;margin-top:4px">
                  ⏳ Pending
                </div>
              </div>
              <div
                (click)="nav('/admin/leaves')"
                style="text-align:center;padding:24px 16px;background:linear-gradient(135deg,#fce4ec,#f8bbd0);border-radius:12px;cursor:pointer"
              >
                <div style="font-size:36px;font-weight:800;color:#c62828">
                  {{ stats?.rejectedLeaves || 0 }}
                </div>
                <div style="color:#e53935;font-size:13px;font-weight:600;margin-top:4px">
                  ❌ Rejected
                </div>
              </div>
            </div>

            <!-- Export & Reports — SHOW PIECE ONLY (no click/download) -->
            <div style="margin-top:20px;padding-top:16px;border-top:1px solid #f0f0f0">
              <p
                style="font-size:11px;color:#aaa;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600"
              >
                Export &amp; Reports
              </p>
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <div
                  style="display:flex;align-items:center;gap:8px;padding:10px 16px;
                  border:1px solid #c8e6c9;border-radius:8px;background:#f9fff9;cursor:default"
                >
                  <mat-icon style="color:#2e7d32;font-size:18px;width:18px;height:18px"
                    >table_view</mat-icon
                  >
                  <span style="font-size:13px;color:#2e7d32;font-weight:500">Export via Excel</span>
                </div>
                <div
                  style="display:flex;align-items:center;gap:8px;padding:10px 16px;
                  border:1px solid #ffcdd2;border-radius:8px;background:#fff9f9;cursor:default"
                >
                  <mat-icon style="color:#c62828;font-size:18px;width:18px;height:18px"
                    >picture_as_pdf</mat-icon
                  >
                  <span style="font-size:13px;color:#c62828;font-weight:500">Export via PDF</span>
                </div>
                <div
                  (click)="nav('/admin/view-profile')"
                  style="display:flex;align-items:center;gap:8px;padding:10px 16px;
                  border:1px solid #c5cae9;border-radius:8px;background:#f8f9ff;cursor:pointer"
                >
                  <mat-icon style="color:#1a237e;font-size:18px;width:18px;height:18px"
                    >qr_code_2</mat-icon
                  >
                  <span style="font-size:13px;color:#1a237e;font-weight:500">Also See QR Code</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <h3 style="margin-bottom:16px;font-weight:700;color:#1a1a2e;font-size:16px">
              ⚡ Quick Actions
            </h3>
            <div style="display:flex;flex-direction:column;gap:10px">
              <button
                mat-stroked-button
                (click)="nav('/admin/employees')"
                style="justify-content:flex-start;gap:8px;height:40px"
              >
                <mat-icon>person_add</mat-icon> Add Employee
              </button>
              <button
                mat-stroked-button
                (click)="nav('/admin/departments')"
                style="justify-content:flex-start;gap:8px;height:40px"
              >
                <mat-icon>add_business</mat-icon> Add Department
              </button>
              <button
                mat-stroked-button
                (click)="nav('/admin/holidays')"
                style="justify-content:flex-start;gap:8px;height:40px"
              >
                <mat-icon>celebration</mat-icon> Add Holiday
              </button>
              <button
                mat-stroked-button
                (click)="nav('/admin/announcements')"
                style="justify-content:flex-start;gap:8px;height:40px"
              >
                <mat-icon>campaign</mat-icon> New Announcement
              </button>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .welcome-banner {
        background: linear-gradient(135deg, #1f1f2c 0%, #25359b 100%);
        border-radius: 16px;
        padding: 28px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        color: #fff;
      }
      .welcome-banner h1 {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .welcome-banner p {
        font-size: 13px;
        opacity: 0.7;
      }
      .banner-icon mat-icon {
        font-size: 56px;
        width: 56px;
        height: 56px;
        opacity: 0.2;
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  stats: any;
  designationsCount = 0;
  announcementsCount = 0;
  goalsCount = 0;
  goalsCompleted = 0;
  goalsInProgress = 0;
  goalsNotStarted = 0;
  loading = true;
  today = new Date();

  quotes = [
    {
      text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
      author: 'भगवद्गीता — अध्याय २, श्लोक ४७',
    },
    { text: 'योगः कर्मसु कौशलम्॥', author: 'भगवद्गीता — अध्याय २, श्लोक ५०' },
    {
      text: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।',
      author: 'भगवद्गीता — अध्याय ३, श्लोक ३५',
    },
    { text: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।', author: 'भगवद्गीता — अध्याय ६, श्लोक ५' },
    { text: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।', author: 'भगवद्गीता — अध्याय १८, श्लोक ६६' },
    { text: 'नायमात्मा बलहीनेन लभ्यः।', author: 'भगवद्गीता — अध्याय ९, श्लोक २२' },
    { text: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।', author: 'भगवद्गीता — अध्याय २, श्लोक ६२' },
  ];
  quote = this.quotes[new Date().getDay() % this.quotes.length];

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => {
      this.loading = false;
    }, 8000);
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
    // Designations count — sirf active wale
    this.adminService.getDesignations().subscribe({
      next: (d: any) => {
        const arr = Array.isArray(d) ? d : d?.content || d?.data?.content || d?.data || [];
        this.designationsCount = arr.filter((x: any) => x.active !== false).length;
      },
    });

    this.adminService.getAnnouncements().subscribe({
      next: (d: any) => {
        const arr = Array.isArray(d) ? d : d?.content || d?.data?.content || d?.data || [];
        this.announcementsCount = arr.filter((a: any) => a.active).length;
      },
    });
    this.adminService.getAllGoals().subscribe({
      next: (d: any) => {
        const arr = Array.isArray(d) ? d : (d?.content || []);
        this.goalsCount = arr.length;
        this.goalsCompleted = arr.filter((g: any) => g.status === 'COMPLETED').length;
        this.goalsInProgress = arr.filter((g: any) => g.status === 'IN_PROGRESS').length;
        this.goalsNotStarted = arr.filter((g: any) => g.status === 'NOT_STARTED').length;
      },
    });
  }

  nav(path: string): void {
    this.router.navigate([path]);
  }
}

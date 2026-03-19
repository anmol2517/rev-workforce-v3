import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <!-- Welcome Banner -->
      <div
        class="card"
        style="background:linear-gradient(135deg,#4a148c,#7b1fa2);color:#fff;padding:28px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px"
      >
        <div>
          <h1 style="font-size:22px;font-weight:700;margin-bottom:6px">
            Welcome, {{ empName }} 👋
          </h1>
          <p style="color:rgba(255,255,255,0.75);font-size:14px">
            {{ today | date: 'EEEE, MMMM d, y' }}
          </p>
        </div>
        <div style="text-align:right;max-width:320px">
          <mat-icon
            style="font-size:20px;width:20px;height:20px;color:#ce93d8;display:block;margin-bottom:4px;margin-left:auto"
            >format_quote</mat-icon
          >
          <p
            style="font-size:13px;font-style:italic;color:rgba(255,255,255,0.88);margin-bottom:2px;line-height:1.5"
          >
            "{{ quote.text }}"
          </p>
          <p style="font-size:11px;color:rgba(255,255,255,0.5)">— {{ quote.src }}</p>
        </div>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <!-- 4 Stats: Pending Leaves | Notifications | My Goals | Team Chat -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
        <div class="card" style="padding:20px;cursor:pointer" (click)="nav('/employee/leaves')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p
                style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;margin-bottom:8px;letter-spacing:.5px"
              >
                Pending Leaves
              </p>
              <h2 style="font-size:34px;font-weight:800;color:#f57f17">{{ pendingLeaveCount }}</h2>
            </div>
            <div
              style="width:44px;height:44px;border-radius:12px;background:#fff8e1;display:flex;align-items:center;justify-content:center"
            >
              <mat-icon style="color:#f9a825">event_busy</mat-icon>
            </div>
          </div>
          <p style="font-size:11px;color:#aaa;margin-top:8px">
            {{
              pendingLeaveCount > 0
                ? pendingLeaveCount + ' awaiting approval'
                : 'No pending requests'
            }}
          </p>
        </div>

        <div
          class="card"
          style="padding:20px;cursor:pointer"
          (click)="nav('/employee/notifications')"
        >
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p
                style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;margin-bottom:8px;letter-spacing:.5px"
              >
                Notifications
              </p>
              <h2 style="font-size:34px;font-weight:800;color:#c62828">{{ unreadNotifCount }}</h2>
            </div>
            <div
              style="width:44px;height:44px;border-radius:12px;background:#fce4ec;display:flex;align-items:center;justify-content:center"
            >
              <mat-icon style="color:#e53935">notifications_staus</mat-icon>
            </div>
          </div>
          <p style="font-size:11px;color:#aaa;margin-top:8px">
            {{ unreadNotifCount > 0 ? unreadNotifCount + ' unread alerts' : 'All caught up!' }}
          </p>
        </div>

        <div class="card" style="padding:20px;cursor:pointer" (click)="nav('/employee/goals')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p
                style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;margin-bottom:8px;letter-spacing:.5px"
              >
                My Goals
              </p>
              <h2 style="font-size:34px;font-weight:800;color:#2e7d32">{{ allGoals.length }}</h2>
            </div>
            <div
              style="width:44px;height:44px;border-radius:12px;background:#e8f5e9;display:flex;align-items:center;justify-content:center"
            >
              <mat-icon style="color:#388e3c">flag</mat-icon>
            </div>
          </div>
          <p style="font-size:11px;color:#aaa;margin-top:8px">
            {{ countGoals('IN_PROGRESS') }} in progress
          </p>
        </div>

        <div class="card" style="padding:20px;cursor:pointer" (click)="nav('/employee/chat')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <p
                style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;margin-bottom:8px;letter-spacing:.5px"
              >
                Team Chat
              </p>
              <h2 style="font-size:34px;font-weight:800;color:#1565c0">💬</h2>
            </div>
            <div
              style="width:44px;height:44px;border-radius:12px;background:#e3f2fd;display:flex;align-items:center;justify-content:center"
            >
              <mat-icon style="color:#1976d2">forum</mat-icon>
            </div>
          </div>
          <p style="font-size:11px;color:#aaa;margin-top:8px">Chat with your team</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card" style="padding:24px;margin-bottom:24px">
        <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:16px;font-size:15px">
          Quick Actions
        </h3>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px">
          <button
            mat-flat-button
            (click)="nav('/employee/leaves')"
            style="background:#fff8e1;color:#e65100;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 0;border-radius:10px;font-weight:600"
          >
            <mat-icon style="font-size:18px;width:18px;height:18px">event_busy</mat-icon> Apply
            Leave
          </button>
          <button
            mat-flat-button
            (click)="nav('/employee/goals')"
            style="background:#e8f5e9;color:#1b5e20;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 0;border-radius:10px;font-weight:600"
          >
            <mat-icon style="font-size:18px;width:18px;height:18px">flag</mat-icon> My Goals
          </button>
          <button
            mat-flat-button
            (click)="nav('/employee/performance-reviews')"
            style="background:#f3e5f5;color:#4a148c;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 0;border-radius:10px;font-weight:600"
          >
            <mat-icon style="font-size:18px;width:18px;height:18px">star_rate</mat-icon> Reviews
          </button>
          <button
            mat-flat-button
            (click)="nav('/employee/directory')"
            style="background:#e3f2fd;color:#0d47a1;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 0;border-radius:10px;font-weight:600"
          >
            <mat-icon style="font-size:18px;width:18px;height:18px">people</mat-icon> Directory
          </button>
          <button
            mat-flat-button
            (click)="nav('/employee/chat')"
            style="background:#e8eaf6;color:#1a237e;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 0;border-radius:10px;font-weight:600"
          >
            <mat-icon style="font-size:18px;width:18px;height:18px">forum</mat-icon> Team Chat
          </button>
        </div>
      </div>

      <!-- Bottom: Leave Balance + Goals Status -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <!-- Leave Balance -->
        <div class="card" style="padding:24px">
          <h3
            style="font-weight:700;color:#1a1a2e;margin-bottom:18px;display:flex;align-items:center;gap:8px;font-size:15px"
          >
            <mat-icon style="color:#f57f17">beach_access</mat-icon> Leave Balance
          </h3>
          <div
            *ngIf="leaveBalances.length === 0"
            style="color:#aaa;font-size:13px;text-align:center;padding:20px"
          >
            No balance data
          </div>
          <div *ngFor="let lb of leaveBalances" style="margin-bottom:16px">
            <div
              style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"
            >
              <span style="font-size:14px;font-weight:700;color:#1a1a2e">{{ lb.leaveType }}</span>
              <span>
                <span style="font-size:20px;font-weight:800;color:#4a148c">{{ lb.remaining }}</span>
                <span style="font-size:12px;color:#aaa"> / {{ lb.total }} days</span>
              </span>
            </div>
            <div style="display:flex;gap:12px;font-size:11px;color:#aaa;margin-bottom:6px">
              <span
                >Total: <strong style="color:#333">{{ lb.total }}</strong></span
              >
              <span
                >Used: <strong style="color:#e53935">{{ lb.used }}</strong></span
              >
              <span
                >Remaining: <strong style="color:#2e7d32">{{ lb.remaining }}</strong></span
              >
            </div>
            <div style="height:7px;background:#e0e0e0;border-radius:4px;overflow:hidden">
              <div
                [style.width]="getUsedPercent(lb) + '%'"
                [style.background]="getUsedPercent(lb) > 75 ? '#e53935' : '#4a148c'"
                style="height:100%;border-radius:4px;transition:width .3s"
              ></div>
            </div>
          </div>
        </div>

        <!-- Goals Status -->
        <div class="card" style="padding:24px">
          <h3
            style="font-weight:700;color:#1a1a2e;margin-bottom:18px;display:flex;align-items:center;gap:8px;font-size:15px"
          >
            <mat-icon style="color:#2e7d32">flag</mat-icon> Goals Status
          </h3>
          <div style="display:flex;flex-direction:column;gap:12px">
            <div
              style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#e8f5e9;border-radius:10px"
            >
              <span
                style="font-size:13px;color:#2e7d32;font-weight:600;display:flex;align-items:center;gap:6px"
              >
                <mat-icon style="font-size:16px;width:16px;height:16px">check_circle</mat-icon>
                Completed
              </span>
              <span style="font-weight:800;color:#2e7d32;font-size:22px">{{
                countGoals('COMPLETED')
              }}</span>
            </div>
            <div
              style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#fff8e1;border-radius:10px"
            >
              <span
                style="font-size:13px;color:#f57f17;font-weight:600;display:flex;align-items:center;gap:6px"
              >
                <mat-icon style="font-size:16px;width:16px;height:16px">autorenew</mat-icon> In
                Progress
              </span>
              <span style="font-weight:800;color:#f57f17;font-size:22px">{{
                countGoals('IN_PROGRESS')
              }}</span>
            </div>
            <div
              style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#fce4ec;border-radius:10px"
            >
              <span
                style="font-size:13px;color:#c62828;font-weight:600;display:flex;align-items:center;gap:6px"
              >
                <mat-icon style="font-size:16px;width:16px;height:16px">pause_circle</mat-icon> Not
                Started
              </span>
              <span style="font-weight:800;color:#c62828;font-size:22px">{{
                countGoals('NOT_STARTED')
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EmployeeDashboardComponent implements OnInit {
  empName = '';
  leaveBalances: any[] = [];
  allGoals: any[] = [];
  allLeaves: any[] = [];
  unreadNotifCount = 0;
  loading = true;
  today = new Date();

  // Pure Bhagavad Gita Sanskrit shlokas only
  quotes = [
    {
      text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
      src: 'Bhagavad Gita 2.47',
    },
    {
      text: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
      src: 'Bhagavad Gita 2.48',
    },
    {
      text: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
      src: 'Bhagavad Gita 6.5',
    },
    {
      text: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥',
      src: 'Bhagavad Gita 3.35',
    },
    {
      text: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः। न चैनं क्लेदयन्त्यापो न शोषयति मारुतः॥',
      src: 'Bhagavad Gita 2.23',
    },
    {
      text: 'व्यवसायात्मिका बुद्धिरेकेह कुरुनन्दन। बहुशाखा ह्यनन्ताश्च बुद्धयोऽव्यवसायिनाम्॥',
      src: 'Bhagavad Gita 2.41',
    },
    {
      text: 'सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ। ततो युद्धाय युज्यस्व नैवं पापमवाप्स्यसि॥',
      src: 'Bhagavad Gita 2.38',
    },
  ];
  quote = this.quotes[new Date().getDay() % this.quotes.length];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 8000);
    this.employeeService.getProfile().subscribe({
      next: (d: any) => {
        this.empName = d?.firstName || 'Employee';
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
    this.employeeService.getLeaveBalance().subscribe({
      next: (d: any) => {
        this.leaveBalances = Array.isArray(d)
          ? d.map((b: any) => ({
              leaveType: b.leaveType,
              total: b.totalDays || b.total,
              used: b.usedDays || b.used,
              remaining: b.remainingDays || b.remaining,
            }))
          : [];
      },
      error: () => {},
    });
    this.employeeService.getMyGoals().subscribe({
      next: (d: any) => {
        this.allGoals = Array.isArray(d) ? d : [];
      },
      error: () => {},
    });
    this.employeeService.getMyLeaves().subscribe({
      next: (d: any) => {
        this.allLeaves = Array.isArray(d) ? d : d?.content || [];
      },
      error: () => {},
    });
    this.employeeService.getUnreadCount().subscribe({
      next: (d: any) => {
        this.unreadNotifCount = typeof d === 'number' ? d : d?.count || 0;
      },
      error: () => {},
    });
  }

  get pendingLeaveCount(): number {
    return this.allLeaves.filter((l: any) => l.status === 'PENDING').length;
  }
  countGoals(status: string): number {
    return this.allGoals.filter((g: any) => g.status === status).length;
  }
  getUsedPercent(lb: any): number {
    return lb.total ? Math.round((lb.used / lb.total) * 100) : 0;
  }
  nav(path: string): void {
    this.router.navigate([path]);
  }
}

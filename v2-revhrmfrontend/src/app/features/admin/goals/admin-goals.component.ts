import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Goal } from '../../../core/models/models';

@Component({
  selector: 'app-admin-goals',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatSelectModule, MatFormFieldModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Goals Overview</h1>
        <div style="display:flex;gap:10px;align-items:center">
          <mat-form-field appearance="outline" style="margin-bottom:-1.25em;min-width:160px">
            <mat-label>Filter by Status</mat-label>
            <mat-select [(ngModel)]="statusFilter" (ngModelChange)="applyFilter()">
              <mat-option value="">All</mat-option>
              <mat-option value="NOT_STARTED">Not Started</mat-option>
              <mat-option value="IN_PROGRESS">In Progress</mat-option>
              <mat-option value="COMPLETED">Completed</mat-option>
              <mat-option value="CANCELLED">Cancelled</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <!-- Stats Bar -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px">
        <div style="padding:16px;background:#e8eaf6;border-radius:12px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:#1a237e">{{ allGoals.length }}</div>
          <div style="font-size:12px;color:#3949ab;font-weight:600">Total Goals</div>
        </div>
        <div style="padding:16px;background:#fff8e1;border-radius:12px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:#f57f17">{{ countByStatus('IN_PROGRESS') }}</div>
          <div style="font-size:12px;color:#f9a825;font-weight:600">In Progress</div>
        </div>
        <div style="padding:16px;background:#e8f5e9;border-radius:12px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:#2e7d32">{{ countByStatus('COMPLETED') }}</div>
          <div style="font-size:12px;color:#388e3c;font-weight:600">Completed</div>
        </div>
        <div style="padding:16px;background:#fce4ec;border-radius:12px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:#c62828">{{ countByStatus('NOT_STARTED') }}</div>
          <div style="font-size:12px;color:#e53935;font-weight:600">Not Started</div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <div *ngIf="!loading && filteredGoals.length === 0" class="empty-state">
        <mat-icon>flag</mat-icon>
        <p>No goals found</p>
      </div>

      <div *ngFor="let g of filteredGoals" class="card" style="margin-bottom:14px;padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">

          <!-- Left: Employee + Goal -->
          <div style="flex:1;min-width:200px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <div style="width:36px;height:36px;border-radius:50%;
                background:linear-gradient(135deg,#006064,#00838f);
                color:#fff;font-size:13px;font-weight:700;
                display:flex;align-items:center;justify-content:center;flex-shrink:0">
                {{ getInitials(g) }}
              </div>
              <div>
                <div style="font-weight:700;color:#1a1a2e;font-size:14px">{{ getEmployeeName(g) }}</div>
                <div style="font-size:11px;color:#aaa">{{ g.createdAt | date:'dd MMM yyyy' }}</div>
              </div>
            </div>
            <p style="font-size:14px;color:#333;margin:0 0 10px;line-height:1.5">{{ g.description }}</p>

            <!-- Progress Bar -->
            <div *ngIf="g.progressPercent !== undefined && g.progressPercent !== null">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="font-size:11px;color:#888">Progress</span>
                <span style="font-size:11px;font-weight:600;color:#1a237e">{{ g.progressPercent }}%</span>
              </div>
              <div style="height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden">
                <div [style.width]="g.progressPercent + '%'"
                  [style.background]="g.progressPercent >= 100 ? '#2e7d32' : '#1a237e'"
                  style="height:100%;border-radius:3px;transition:width 0.3s"></div>
              </div>
            </div>
          </div>

          <!-- Right: Status + Priority + Deadline -->
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
            <span class="status-chip" [class]="getStatusClass(g.status)">
              {{ getStatusLabel(g.status) }}
            </span>
            <span [style.background]="getPriorityBg(g.priority)"
              [style.color]="getPriorityColor(g.priority)"
              style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600">
              {{ g.priority }} Priority
            </span>
            <div style="display:flex;align-items:center;gap:4px;font-size:12px;color:#888">
              <mat-icon style="font-size:14px;width:14px;height:14px">event</mat-icon>
              Deadline: {{ g.deadline | date:'dd MMM yyyy' }}
            </div>
          </div>
        </div>

        <!-- Manager Comment -->
        <div *ngIf="g.managerComments"
          style="margin-top:12px;padding:10px 14px;background:#f3e5f5;border-radius:8px;
            border-left:3px solid #7b1fa2">
          <span style="font-size:11px;color:#7b1fa2;font-weight:600">Manager Comment: </span>
          <span style="font-size:13px;color:#555">{{ g.managerComments }}</span>
        </div>
      </div>
    </div>
  `
})
export class AdminGoalsComponent implements OnInit {
  allGoals: Goal[] = [];
  filteredGoals: Goal[] = [];
  statusFilter = '';
  loading = true;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    this.adminService.getAllGoals().subscribe({
      next: (d: any) => {
        this.allGoals = Array.isArray(d) ? d : [];
        this.filteredGoals = [...this.allGoals];
        this.loading = false;
        },
      error: () => this.loading = false
    });
  }

  applyFilter(): void {
    this.filteredGoals = this.statusFilter
      ? this.allGoals.filter(g => g.status === this.statusFilter)
      : [...this.allGoals];
  }

  countByStatus(status: string): number {
    return this.allGoals.filter(g => g.status === status).length;
  }

  getInitials(g: Goal): string {
    const name = g.employee ? `${g.employee.firstName} ${g.employee.lastName}` : '?';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  getEmployeeName(g: Goal): string {
    return g.employee ? `${g.employee.firstName} ${g.employee.lastName}` : 'Unknown Employee';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'COMPLETED': 'APPROVED',
      'IN_PROGRESS': 'PENDING',
      'NOT_STARTED': 'REJECTED',
      'CANCELLED': 'CANCELLED'
    };
    return map[status] || 'PENDING';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'NOT_STARTED': '⏸ Not Started',
      'IN_PROGRESS': '🔄 In Progress',
      'COMPLETED': '✅ Completed',
      'CANCELLED': '❌ Cancelled'
    };
    return map[status] || status;
  }

  getPriorityBg(p: string): string {
    return p === 'HIGH' ? '#fce4ec' : p === 'MEDIUM' ? '#fff8e1' : '#e8f5e9';
  }

  getPriorityColor(p: string): string {
    return p === 'HIGH' ? '#c62828' : p === 'MEDIUM' ? '#f57f17' : '#2e7d32';
  }
}
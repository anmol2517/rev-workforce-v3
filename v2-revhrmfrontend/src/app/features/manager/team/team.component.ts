import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ManagerService } from '../../../core/services/manager.service';
import { User } from '../../../core/models/models';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>My Team</h1>
        <span style="background:#e8f5e9;color:#2e7d32;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
          {{ team.length }} Members
        </span>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <div *ngIf="!loading && team.length === 0" class="empty-state">
        <mat-icon>group_off</mat-icon>
        <p>No team members found</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
        <div *ngFor="let e of team" class="card" style="padding:20px;border-top:4px solid #2e7d32">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
            <div style="width:52px;height:52px;border-radius:50%;
              background:linear-gradient(135deg,#1b5e20,#2e7d32);
              color:#fff;font-size:18px;font-weight:700;
              display:flex;align-items:center;justify-content:center;flex-shrink:0">
              {{ e.firstName.charAt(0) }}{{ e.lastName.charAt(0) }}
            </div>
            <div style="flex:1">
              <div style="font-weight:700;color:#1a1a2e;font-size:16px">{{ e.firstName }} {{ e.lastName }}</div>
              <div style="font-size:12px;color:#888">{{ e.employeeId }}</div>
            </div>
            <div style="display:flex;align-items:center;gap:4px">
              <span class="status-chip APPROVED" style="font-size:11px">{{ e.status }}</span>
              <button mat-icon-button (click)="viewProfile(e.employeeId)"
                title="View Profile" style="color:#1b5e20;width:32px;height:32px">
                <mat-icon style="font-size:20px;width:20px;height:20px">visibility</mat-icon>
              </button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div style="padding:10px;background:#f8f9fa;border-radius:8px">
              <div style="font-size:10px;color:#aaa;margin-bottom:3px">Department</div>
              <div style="font-size:12px;font-weight:600;color:#333">{{ e.departmentName || 'N/A' }}</div>
            </div>
            <div style="padding:10px;background:#f8f9fa;border-radius:8px">
              <div style="font-size:10px;color:#aaa;margin-bottom:3px">Designation</div>
              <div style="font-size:12px;font-weight:600;color:#333">{{ e.designationName || 'N/A' }}</div>
            </div>
            <div style="padding:10px;background:#f8f9fa;border-radius:8px">
              <div style="font-size:10px;color:#aaa;margin-bottom:3px">Email</div>
              <div style="font-size:11px;color:#555;word-break:break-all">{{ e.email }}</div>
            </div>
            <div style="padding:10px;background:#f8f9fa;border-radius:8px">
              <div style="font-size:10px;color:#aaa;margin-bottom:3px">Phone</div>
              <div style="font-size:12px;color:#555">{{ e.phone || 'N/A' }}</div>
            </div>
            <div *ngIf="e.joiningDate" style="padding:10px;background:#e8f5e9;border-radius:8px;grid-column:span 2">
              <div style="font-size:10px;color:#388e3c;margin-bottom:3px">Joined</div>
              <div style="font-size:12px;font-weight:600;color:#2e7d32">{{ e.joiningDate | date:'dd MMM yyyy' }}</div>
            </div>
          </div>

          <!-- View Profile Footer -->
          <div style="margin-top:14px;padding-top:12px;border-top:1px solid #f0f0f0">
            <button mat-flat-button (click)="viewProfile(e.employeeId)"
              style="width:100%;background:#e8f5e9;color:#1b5e20;display:flex;align-items:center;gap:6px;justify-content:center">
              <mat-icon style="font-size:18px;width:18px;height:18px">visibility</mat-icon>
              View Full Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamComponent implements OnInit {
  team: User[] = [];
  loading = true;

  constructor(
    private managerService: ManagerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  viewProfile(id: number): void {
    this.router.navigate(['/manager/view-employee', id]);
  }

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    this.managerService.getTeamMembers().subscribe({
      next: (d: any) => {
        this.team = Array.isArray(d) ? d : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error loading team', 'Close', { duration: 2000 });
      }
    });
  }
}
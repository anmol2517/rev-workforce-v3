import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ManagerService } from '../../../core/services/manager.service';
import { LeaveApplication } from '../../../core/models/models';

@Component({
  selector: 'app-manager-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Leave Requests</h1>
        <div style="display:flex;gap:10px">
          <span style="background:#fff8e1;color:#f57f17;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
            {{ pendingCount }} Pending
          </span>
        </div>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <div *ngIf="!loading && leaves.length === 0" class="empty-state">
        <mat-icon>event_available</mat-icon>
        <p>No leave requests found</p>
      </div>

      <div *ngFor="let l of leaves" class="card" style="margin-bottom:14px;padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;border-radius:50%;
              background:linear-gradient(135deg,#1b5e20,#2e7d32);
              color:#fff;font-size:15px;font-weight:700;
              display:flex;align-items:center;justify-content:center;flex-shrink:0">
              {{ getInitials(l) }}
            </div>
            <div>
              <div style="font-weight:700;color:#1a1a2e">{{ l.employeeName || (l.employee?.firstName + ' ' + l.employee?.lastName) }}</div>
              <div style="font-size:12px;color:#888">{{ l.leaveType || l.leaveType }}</div>
            </div>
          </div>
          <span class="status-chip" [class]="l.status">{{ l.status }}</span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0">
          <div style="padding:10px;background:#f8f9fa;border-radius:8px">
            <div style="font-size:10px;color:#aaa;margin-bottom:3px">From</div>
            <div style="font-size:13px;font-weight:600;color:#1a1a2e">{{ l.startDate | date:'dd MMM yyyy' }}</div>
          </div>
          <div style="padding:10px;background:#f8f9fa;border-radius:8px">
            <div style="font-size:10px;color:#aaa;margin-bottom:3px">To</div>
            <div style="font-size:13px;font-weight:600;color:#1a1a2e">{{ l.endDate | date:'dd MMM yyyy' }}</div>
          </div>
          <div style="padding:10px;background:#e8eaf6;border-radius:8px">
            <div style="font-size:10px;color:#3949ab;margin-bottom:3px">Days</div>
            <div style="font-size:13px;font-weight:600;color:#1a237e">{{ l.numberOfDays || '-' }}</div>
          </div>
        </div>

        <div style="padding:10px;background:#f5f5f5;border-radius:8px;margin-bottom:14px">
          <span style="font-size:11px;color:#888;font-weight:600">Reason: </span>
          <span style="font-size:13px;color:#555">{{ l.reason }}</span>
        </div>

        <div *ngIf="l.status === 'PENDING'" style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
          <mat-form-field appearance="outline" style="flex:1;min-width:200px;margin-bottom:-1.25em">
            <mat-label>Comment (optional)</mat-label>
            <input matInput [(ngModel)]="comments[l.leaveId!]" placeholder="Add a comment..." />
          </mat-form-field>
          <button mat-flat-button (click)="approve(l)"
            [disabled]="processingId === (l.leaveId!)"
            style="background:#2e7d32;color:#fff;gap:6px">
            <mat-icon>check_circle</mat-icon>
            {{ processingId === (l.leaveId!) ? 'Processing...' : 'Approve' }}
          </button>
          <button mat-stroked-button (click)="reject(l)"
            [disabled]="processingId === (l.leaveId!)"
            style="border-color:#c62828;color:#c62828;gap:6px">
            <mat-icon>cancel</mat-icon> Reject
          </button>
        </div>

        <div *ngIf="l.status !== 'PENDING' && (l.approvalComment || l.approverName)"
          style="margin-top:10px;padding:10px;background:#f3e5f5;border-radius:8px;border-left:3px solid #7b1fa2">
          <span style="font-size:11px;color:#7b1fa2;font-weight:600">{{ l.approverName || 'Manager' }}: </span>
          <span style="font-size:13px;color:#555">{{ l.approvalComment || 'No comment' }}</span>
        </div>
      </div>
    </div>
  `
})
export class ManagerLeavesComponent implements OnInit {
  leaves: LeaveApplication[] = [];
  comments: Record<number, string> = {};
  loading = true;
  processingId: number | null = null;

  get pendingCount() { return this.leaves.filter(l => l.status === 'PENDING').length; }

  constructor(private managerService: ManagerService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000); this.load(); }

  load(): void {
    this.loading = true;
    this.managerService.getTeamLeaves().subscribe({
      next: (d: any) => { this.leaves = Array.isArray(d) ? d : (d?.content || []); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  approve(l: LeaveApplication): void {
    this.processingId = l.leaveId!;
    this.managerService.approveLeave(l.leaveId!, this.comments[l.leaveId!] || 'Approved').subscribe({
      next: () => { this.processingId = null; this.snackBar.open('Leave approved!', 'Close', { duration: 2000 }); this.load(); },
      error: () => { this.processingId = null; this.snackBar.open('Error', 'Close', { duration: 2000 }); }
    });
  }

  reject(l: LeaveApplication): void {
    if (!this.comments[l.leaveId!]?.trim()) {
      this.snackBar.open('Please add a reason for rejection', 'Close', { duration: 2000 }); return;
    }
    this.processingId = l.leaveId!;
    this.managerService.rejectLeave(l.leaveId!, this.comments[l.leaveId!]).subscribe({
      next: () => { this.processingId = null; this.snackBar.open('Leave rejected', 'Close', { duration: 2000 }); this.load(); },
      error: () => { this.processingId = null; this.snackBar.open('Error', 'Close', { duration: 2000 }); }
    });
  }

  getInitials(l: LeaveApplication): string {
    const name = l.employeeName || `${l.employee?.firstName || '?'} ${l.employee?.lastName || ''}`;
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  }
}
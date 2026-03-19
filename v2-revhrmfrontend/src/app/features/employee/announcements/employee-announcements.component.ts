import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-announcements',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Announcements</h1>
        <span style="background:#e0f2f1;color:#00695c;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
          {{ announcements.length }} Total
        </span>
      </div>
      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>
      <div *ngIf="!loading && announcements.length === 0" class="empty-state">
        <mat-icon>campaign</mat-icon><p>No announcements yet</p>
      </div>
      <div *ngFor="let a of announcements" class="card"
        style="margin-bottom:14px;padding:20px;border-left:4px solid #00897b">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
          <mat-icon style="color:#00897b;font-size:22px;flex-shrink:0">campaign</mat-icon>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
              <strong style="font-size:16px;color:#1a1a2e">{{ a.title }}</strong>
              <span [style.background]="a.isActive ? '#e8f5e9' : '#f5f5f5'"
                [style.color]="a.isActive ? '#2e7d32' : '#999'"
                style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;white-space:nowrap">
                {{ a.isActive ? '🟢 staus' : '⚫ Instaus' }}
              </span>
            </div>
          </div>
        </div>
        <p style="color:#555;line-height:1.7;font-size:14px;margin:0 0 10px">{{ a.content }}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#aaa">
          <span *ngIf="a.createdBy" style="display:flex;align-items:center;gap:4px">
            <mat-icon style="font-size:13px;width:13px;height:13px">person</mat-icon>
            {{ a.createdBy?.firstName }} {{ a.createdBy?.lastName }}
          </span>
          <span *ngIf="a.createdAt" style="display:flex;align-items:center;gap:4px">
            <mat-icon style="font-size:13px;width:13px;height:13px">calendar_today</mat-icon>
            {{ a.createdAt | date:'dd MMM yyyy' }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class EmployeeAnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  loading = true;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    this.employeeService.getAnnouncements().subscribe({
      next: (d: any) => {
        const arr = Array.isArray(d) ? d : (d?.content || []);
this.announcements = arr.filter((a: any) => a.active !== false);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
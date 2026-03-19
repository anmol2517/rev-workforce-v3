import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Announcement } from '../../../core/models/models';
import { ManagerService } from '../../../core/services/manager.service';

@Component({
  selector: 'app-manager-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatInputModule, MatFormFieldModule],
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
        <mat-icon>campaign</mat-icon>
        <p>No announcements yet</p>
      </div>

      <div *ngFor="let a of announcements" class="card" style="margin-bottom:14px;padding:20px;border-left:4px solid #00897b">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <mat-icon style="color:#00897b;font-size:18px;width:18px;height:18px">campaign</mat-icon>
              <h3 style="font-weight:700;color:#1a1a2e;font-size:15px;margin:0">{{ a.title }}</h3>
            </div>
            <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 10px">{{ a.content }}</p>
            <div style="display:flex;align-items:center;gap:12px;font-size:12px;color:#aaa">
              <span style="display:flex;align-items:center;gap:4px">
                <mat-icon style="font-size:13px;width:13px;height:13px">calendar_today</mat-icon>
                {{ a.createdAt | date:'dd MMM yyyy, hh:mm a' }}
              </span>
              <span *ngIf="a.createdBy" style="display:flex;align-items:center;gap:4px">
                <mat-icon style="font-size:13px;width:13px;height:13px">person</mat-icon>
                {{ a.createdBy.firstName }} {{ a.createdBy.lastName }}
              </span>
            </div>
          </div>
          <span [style.background]="a.isActive ? '#e8f5e9' : '#f5f5f5'"
            [style.color]="a.isActive ? '#2e7d32' : '#999'"
            style="padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600;white-space:nowrap">
            {{ a.isActive ? '🟢 staus' : '⚫ Instaus' }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class ManagerAnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  loading = true;

  constructor(private managerService: ManagerService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    this.managerService.getAnnouncements().subscribe({
     next: (d: any) => {
        const arr = Array.isArray(d) ? d : (d?.content || []);
this.announcements = arr.filter((a: any) => a.active !== false);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
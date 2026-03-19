import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Holiday } from '../../../core/models/models';

@Component({
  selector: 'app-manager-holidays',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Company Holidays</h1>
        <span style="background:#e8f5e9;color:#2e7d32;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
          {{ holidays.length }} Holidays
        </span>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>
      <div *ngIf="!loading && holidays.length === 0" class="empty-state">
        <mat-icon>celebration</mat-icon>
        <p>No holidays found</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
        <div *ngFor="let h of holidays" class="card"
          style="padding:20px;border-left:4px solid"
          [style.border-left-color]="h.type === 'OPTIONAL' || h.type === 'OPTIONAL' ? '#f57f17' : '#2e7d32'">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:40px;height:40px;border-radius:10px;
                display:flex;align-items:center;justify-content:center;font-size:20px"
                [style.background]="h.type === 'OPTIONAL' || h.type === 'OPTIONAL' ? '#fff8e1' : '#e8f5e9'">
                {{ h.type === 'OPTIONAL' || h.type === 'OPTIONAL' ? '🟡' : '🟢' }}
              </div>
              <div>
                <div style="font-weight:700;color:#1a1a2e;font-size:15px">{{ h.name }}</div>
                <div style="font-size:12px;color:#888;margin-top:2px">
                  {{ h.date || h.date | date:'EEEE, dd MMMM yyyy' }}
                </div>
              </div>
            </div>
            <span [style.background]="h.type === 'OPTIONAL' || h.type === 'OPTIONAL' ? '#fff8e1' : '#e8f5e9'"
              [style.color]="h.type === 'OPTIONAL' || h.type === 'OPTIONAL' ? '#f57f17' : '#2e7d32'"
              style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;white-space:nowrap">
              {{ h.type === 'OPTIONAL' || h.type === 'OPTIONAL' ? 'Optional' : 'Mandatory' }}
            </span>
          </div>
          <p *ngIf="h.description" style="font-size:13px;color:#777;margin:0;line-height:1.5">{{ h.description }}</p>
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid #f0f0f0;font-size:12px;color:#aaa;display:flex;align-items:center;gap:4px">
            <mat-icon style="font-size:13px;width:13px;height:13px">event</mat-icon>
            {{ getDaysLeft(h.date || h.date) }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class ManagerHolidaysComponent implements OnInit {
  holidays: Holiday[] = [];
  loading = true;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    this.http.get<any>(`${environment.apiUrl}/api/admin/holidays/current-year`).subscribe({
      next: (d: any) => {
        this.holidays = Array.isArray(d) ? d : [];
        this.holidays.sort((a, b) => new Date(a.date || a.date || 0).getTime() - new Date(b.date || b.date || 0).getTime());
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getDaysLeft(date: string): string {
    const today = new Date();
    const hDate = new Date(date);
    const diff = Math.ceil((hDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Already passed';
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow!';
    return `${diff} days remaining`;
  }
}
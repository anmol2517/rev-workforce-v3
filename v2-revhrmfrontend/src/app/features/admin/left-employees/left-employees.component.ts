import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-left-employees',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Left / Deactivated Employees</h1>
        <span style="background:#fce4ec;color:#c62828;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
          {{ leftEmployees.length }} Deactivated
        </span>
      </div>
      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>
      <div *ngIf="!loading && leftEmployees.length === 0" class="empty-state">
        <mat-icon>how_to_reg</mat-icon>
        <p>No deactivated employees found</p>
      </div>
      <div *ngIf="!loading && leftEmployees.length > 0">
        <p style="color:#888;font-size:13px;margin-bottom:20px">
          These employees are deactivated. Click <strong>Reactivate</strong> to restore access.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px">
          <div *ngFor="let e of leftEmployees" class="card" style="padding:20px;border-left:4px solid #ef9a9a">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#b71c1c,#e53935);
                color:#fff;font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                {{ (e.firstName||'?').charAt(0) }}{{ (e.lastName||'').charAt(0) }}
              </div>
              <div style="flex:1">
                <div style="font-weight:700;color:#1a1a2e;font-size:16px">{{ e.firstName }} {{ e.lastName }}</div>
                <div style="font-size:12px;color:#888;margin-top:2px">{{ e.empCode || 'ID: '+e.employeeId }}</div>
              </div>
              <span style="background:#fce4ec;color:#c62828;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600">INACTIVE</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
              <div style="padding:10px;background:#f8f9fa;border-radius:8px">
                <div style="font-size:11px;color:#aaa;margin-bottom:3px">Email</div>
                <div style="font-size:12px;color:#555;word-break:break-all">{{ e.email }}</div>
              </div>
              <div style="padding:10px;background:#f8f9fa;border-radius:8px">
                <div style="font-size:11px;color:#aaa;margin-bottom:3px">Role</div>
                <div style="font-size:12px;font-weight:600;color:#1a1a2e">{{ e.role }}</div>
              </div>
              <div style="padding:10px;background:#f8f9fa;border-radius:8px">
                <div style="font-size:11px;color:#aaa;margin-bottom:3px">Department</div>
                <div style="font-size:12px;color:#555">{{ e.departmentName || 'N/A' }}</div>
              </div>
              <div style="padding:10px;background:#f8f9fa;border-radius:8px">
                <div style="font-size:11px;color:#aaa;margin-bottom:3px">Designation</div>
                <div style="font-size:12px;color:#555">{{ e.designationName || 'N/A' }}</div>
              </div>
            </div>
            <button mat-flat-button (click)="reactivate(e)" [disabled]="activatingId === e.employeeId"
              style="width:100%;background:#1b5e20;color:#fff">
              <mat-icon>how_to_reg</mat-icon>
              {{ activatingId === e.employeeId ? 'Activating...' : 'Reactivate Employee' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeftEmployeesComponent implements OnInit {
  leftEmployees: any[] = [];
  loading = true;
  activatingId: number | null = null;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  setTimeout(() => { this.loading = false; }, 8000);
  this.loading = true;
  this.adminService.getEmployees(0, 200, undefined, undefined, 'INACTIVE').subscribe({
    next: (all: any) => {
      const arr = Array.isArray(all) ? all : (all?.content || all?.data?.content || all?.data || []);
      this.leftEmployees = arr.filter((e: any) => {
        const s = (e.status || '').toUpperCase();
        return s === 'INACTIVE' || s === 'SUSPENDED';
      });
      this.loading = false;
    },
    error: () => this.loading = false
  });
}

  load(): void {
    this.loading = true;
    this.adminService.getEmployees(0, 200, undefined, undefined, 'INACTIVE').subscribe({
      next: (all: any) => {
        const arr = Array.isArray(all) ? all : (all?.content || all?.data?.content || all?.data || []);
        this.leftEmployees = arr.filter((e: any) => {
          const s = (e.status || '').toUpperCase();
          return s === 'INACTIVE' || s === 'SUSPENDED';
        });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  reactivate(emp: any): void {
    this.activatingId = emp.employeeId;
    this.adminService.activateEmployee(emp.employeeId).subscribe({
      next: () => {
        this.leftEmployees = this.leftEmployees.filter(e => e.employeeId !== emp.employeeId);
        this.activatingId = null;
        this.snackBar.open(`${emp.firstName} reactivated!`, 'Close', { duration: 3000 });
      },
      error: () => { this.activatingId = null; this.snackBar.open('Error!', 'Close', { duration: 2000 }); }
    });
  }
}
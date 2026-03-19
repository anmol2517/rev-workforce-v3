import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-directory',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule,
    MatProgressSpinnerModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Employee Directory</h1>
        <span style="background:#e3f2fd;color:#1565c0;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
          {{ employees.length }} Employees
        </span>
      </div>
      <div class="card" style="padding:20px;margin-bottom:20px">
        <mat-form-field appearance="outline" style="width:100%;max-width:400px;margin-bottom:-1.25em">
          <mat-label>Search by name, department...</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Type to search...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>
      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>
      <div *ngIf="!loading && employees.length === 0" class="empty-state">
        <mat-icon>contacts</mat-icon><p>No employees found</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px">
        <div *ngFor="let e of employees" class="card" style="padding:18px;border-top:4px solid #4a148c">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
            <div style="width:46px;height:46px;border-radius:50%;
              background:linear-gradient(135deg,#4a148c,#6a1b9a);
              color:#fff;font-size:16px;font-weight:700;
              display:flex;align-items:center;justify-content:center;flex-shrink:0">
              {{ (e.firstName||'?').charAt(0) }}{{ (e.lastName||'').charAt(0) }}
            </div>
            <div>
              <div style="font-weight:700;color:#1a1a2e;font-size:14px">{{ e.firstName }} {{ e.lastName }}</div>
              <div style="font-size:12px;color:#888">{{ e.empCode || ('ID: ' + e.employeeId) }}</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#555">
              <mat-icon style="font-size:15px;width:15px;height:15px;color:#7b1fa2">email</mat-icon>
              {{ e.email }}
            </div>
            <div *ngIf="e.departmentName"
              style="display:flex;align-items:center;gap:8px;font-size:13px;color:#555">
              <mat-icon style="font-size:15px;width:15px;height:15px;color:#7b1fa2">business</mat-icon>
              {{ e.departmentName }}
            </div>
            <div *ngIf="e.designationName"
              style="display:flex;align-items:center;gap:8px;font-size:13px;color:#555">
              <mat-icon style="font-size:15px;width:15px;height:15px;color:#7b1fa2">badge</mat-icon>
              {{ e.designationName }}
            </div>
            <div *ngIf="e.phone"
              style="display:flex;align-items:center;gap:8px;font-size:13px;color:#555">
              <mat-icon style="font-size:15px;width:15px;height:15px;color:#7b1fa2">phone</mat-icon>
              {{ e.phone }}
            </div>
          </div>
          <span class="status-chip" [class]="e.role" style="margin-top:12px;display:inline-block">
            {{ e.role }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class EmployeeDirectoryComponent implements OnInit {
  employees: any[] = [];
  allEmployees: any[] = [];
  searchQuery = '';
  loading = true;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    setTimeout(() => { this.loading = false; }, 8000);
    this.loading = true;
    this.employeeService.getDirectory(0, 200).subscribe({
      next: (d: any) => {
        this.allEmployees = Array.isArray(d) ? d : (d?.content || []);
        this.employees = [...this.allEmployees];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) { this.employees = [...this.allEmployees]; return; }
    this.employees = this.allEmployees.filter(e =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.departmentName || '').toLowerCase().includes(q) ||
      (e.designationName || '').toLowerCase().includes(q) ||
      String(e.employeeId).includes(q)
    );
  }
}
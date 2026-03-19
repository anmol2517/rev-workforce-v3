import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ManagerService } from '../../../core/services/manager.service';
import { User } from '../../../core/models/models';

@Component({
  selector: 'app-manager-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>My Profile</h1></div>
      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <div *ngIf="profile && !loading" style="display:grid;grid-template-columns:300px 1fr;gap:24px">

        <!-- LEFT CARD -->
        <div class="card" style="padding:24px;text-align:center">
          <div style="margin:0 auto 14px;width:110px;height:110px;display:flex;align-items:center;justify-content:center;border:2px solid #c8e6c9;border-radius:12px;background:#f9fff9">
            <div id="qrcode" style="width:96px;height:96px"></div>
          </div>
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#1b5e20,#2e7d32);color:#fff;font-size:26px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
            {{ profile.firstName.charAt(0) }}{{ profile.lastName.charAt(0) }}
          </div>
          <h2 style="font-size:18px;font-weight:700;color:#1a1a2e;margin-bottom:4px">{{ profile.firstName }} {{ profile.lastName }}</h2>
          <p style="color:#888;font-size:13px;margin-bottom:8px">{{ profile.employeeId }}</p>
          <span class="status-chip MANAGER" style="display:inline-block;margin-bottom:6px">MANAGER</span><br>
          <span class="status-chip APPROVED" style="display:inline-block;margin-top:6px">{{ profile.status }}</span>
          <div style="margin-top:16px;text-align:left;border-top:1px solid #f0f0f0;padding-top:14px">
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">email</mat-icon>{{ profile.email }}
            </p>
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">business</mat-icon>{{ profile.departmentName || 'N/A' }}
            </p>
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">badge</mat-icon>{{ profile.designationName || 'N/A' }}
            </p>
            <p *ngIf="profile.phone" style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">phone</mat-icon>{{ profile.phone }}
            </p>
            <p *ngIf="profile.joiningDate" style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">calendar_today</mat-icon>
              Joined: {{ profile.joiningDate | date:'dd MMM yyyy' }}
            </p>
            <p *ngIf="profile.address" style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">location_on</mat-icon>{{ profile.address }}
            </p>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div style="display:flex;flex-direction:column;gap:20px">

          <!-- Employment Details -->
          <div class="card" style="padding:24px" *ngIf="!editMode">
            <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:20px">Employment Details</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
              <div style="padding:14px;background:#f8f9fa;border-radius:10px">
                <div style="font-size:11px;color:#888;margin-bottom:5px">Employee ID</div>
                <div style="font-weight:700;color:#1a1a2e">{{ profile.employeeId }}</div>
              </div>
              <div style="padding:14px;background:#f8f9fa;border-radius:10px">
                <div style="font-size:11px;color:#888;margin-bottom:5px">Role</div>
                <div style="font-weight:700;color:#1a1a2e">{{ profile.role }}</div>
              </div>
              <div style="padding:14px;background:#f8f9fa;border-radius:10px">
                <div style="font-size:11px;color:#888;margin-bottom:5px">Department</div>
                <div style="font-weight:700;color:#1a1a2e">{{ profile.departmentName || 'N/A' }}</div>
              </div>
              <div style="padding:14px;background:#f8f9fa;border-radius:10px">
                <div style="font-size:11px;color:#888;margin-bottom:5px">Designation</div>
                <div style="font-weight:700;color:#1a1a2e">{{ profile.designationName || 'N/A' }}</div>
              </div>
              <div *ngIf="profile.salary" style="padding:14px;background:#e8f5e9;border-radius:10px">
                <div style="font-size:11px;color:#388e3c;margin-bottom:5px">Salary</div>
                <div style="font-weight:700;color:#2e7d32">₹{{ profile.salary | number }}</div>
              </div>
              <div style="padding:14px;background:#e8eaf6;border-radius:10px">
                <div style="font-size:11px;color:#3949ab;margin-bottom:5px">Status</div>
                <div style="font-weight:700;color:#1a237e">{{ profile.status }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons — salary/status ke niche -->
          <div class="card" style="padding:20px" *ngIf="!editMode">
            <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:16px">Actions</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <button mat-flat-button (click)="editMode = true"
                style="background:#1b5e20;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>edit</mat-icon> Edit Profile
              </button>
              <button mat-flat-button (click)="downloadPdf()"
                style="background:#b71c1c;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>picture_as_pdf</mat-icon> Download PDF
              </button>
              <button mat-flat-button (click)="downloadExcel()"
                style="background:#2e7d32;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>table_view</mat-icon> Download Excel
              </button>
              <button mat-flat-button (click)="downloadQr()"
                style="background:#1565c0;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>qr_code_2</mat-icon> Download QR
              </button>
            </div>
          </div>

          <!-- Edit Form -->
          <div class="card" style="padding:24px" *ngIf="editMode">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
              <h3 style="font-weight:700;color:#1a1a2e;margin:0">Edit Profile</h3>
              <button mat-icon-button (click)="editMode = false"><mat-icon>close</mat-icon></button>
            </div>
            <form [formGroup]="editForm" (ngSubmit)="save()">
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Phone Number</mat-label>
                  <input matInput formControlName="phone" />
                </mat-form-field>
                <mat-form-field appearance="outline" style="grid-column:span 2">
                  <mat-label>Address</mat-label>
                  <input matInput formControlName="address" />
                </mat-form-field>
              </div>
              <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px">
                <button mat-button type="button" (click)="editMode = false">Cancel</button>
                <button mat-flat-button type="submit" [disabled]="editForm.invalid || saving"
                  style="background:#1b5e20;color:#fff">
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

        </div>
        <!-- END RIGHT SIDE -->

      </div>
    </div>
  `
})
export class ManagerProfileComponent implements OnInit {
  profile: User | null = null;
  loading = true;
  editMode = false;
  saving = false;
  editForm!: FormGroup;

  constructor(private managerService: ManagerService, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.managerService.getProfile().subscribe({
      next: (d: any) => {
        this.profile = Array.isArray(d) ? d[0] : d;
        this.initForm();
        this.loading = false;
        setTimeout(() => this.generateQr(), 300);
      },
      error: () => this.loading = false
    });
  }

  initForm(): void {
    this.editForm = this.fb.group({
      firstName: [this.profile?.firstName || '', Validators.required],
      lastName: [this.profile?.lastName || '', Validators.required],
      phone: [this.profile?.phone || ''],
      address: [this.profile?.address || '']
    });
  }

  save(): void {
    if (this.editForm.invalid) return;
    this.saving = true;
    this.managerService.updateProfile(this.editForm.value).subscribe({
      next: () => {
        this.profile = { ...this.profile!, ...this.editForm.value };
        this.saving = false;
        this.editMode = false;
        this.snackBar.open('Profile updated!', 'Close', { duration: 2000 });
        setTimeout(() => this.generateQr(), 300);
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Error updating profile', 'Close', { duration: 2000 });
      }
    });
  }

  generateQr(): void {
    const el = document.getElementById('qrcode');
    if (!el || !this.profile) return;
    el.innerHTML = '';
    const data = `EMP:${this.profile.employeeId}|NAME:${this.profile.firstName} ${this.profile.lastName}|DEPT:${this.profile.departmentName || ''}|EMAIL:${this.profile.email}`;
    const img = document.createElement('img');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(data)}`;
    img.style.width = '96px';
    img.style.height = '96px';
    el.appendChild(img);
  }

  downloadQr(): void {
    if (!this.profile) return;
    const data = `EMP:${this.profile.employeeId}|NAME:${this.profile.firstName} ${this.profile.lastName}|DEPT:${this.profile.departmentName || ''}|EMAIL:${this.profile.email}`;
    const a = document.createElement('a');
    a.href = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
    a.target = '_blank';
    a.download = `QR_${this.profile.employeeId}.png`;
    a.click();
  }

  downloadPdf(): void {
    if (!this.profile) return;
    const p = this.profile;
    const html = `<html><head><title>Manager Profile</title>
      <style>
        body{font-family:Arial,sans-serif;padding:32px;color:#222}
        h1{color:#1b5e20;border-bottom:2px solid #1b5e20;padding-bottom:8px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}
        .box{padding:14px;background:#f5f5f5;border-radius:8px}
        .label{font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase}
        .value{font-weight:700;color:#1a1a2e;font-size:15px}
        .badge{display:inline-block;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600;background:#e8f5e9;color:#2e7d32;margin:4px 4px 0 0}
        .footer{margin-top:40px;font-size:11px;color:#aaa;border-top:1px solid #eee;padding-top:12px}
      </style></head><body>
        <h1>Manager Profile Report</h1>
        <span class="badge">MANAGER</span><span class="badge">${p.status}</span>
        <div class="grid">
          <div class="box"><div class="label">Full Name</div><div class="value">${p.firstName} ${p.lastName}</div></div>
          <div class="box"><div class="label">Employee ID</div><div class="value">${p.employeeId}</div></div>
          <div class="box"><div class="label">Email</div><div class="value">${p.email}</div></div>
          <div class="box"><div class="label">Phone</div><div class="value">${p.phone || 'N/A'}</div></div>
          <div class="box"><div class="label">Department</div><div class="value">${p.departmentName || 'N/A'}</div></div>
          <div class="box"><div class="label">Designation</div><div class="value">${p.designationName || 'N/A'}</div></div>
          <div class="box"><div class="label">Joining Date</div><div class="value">${p.joiningDate ? new Date(p.joiningDate).toLocaleDateString('en-IN', {day:'2-digit',month:'long',year:'numeric'}) : 'N/A'}</div></div>
          ${p.salary ? `<div class="box"><div class="label">Salary</div><div class="value">₹${Number(p.salary).toLocaleString('en-IN')}</div></div>` : ''}
          <div class="box" style="grid-column:span 2"><div class="label">Address</div><div class="value">${p.address || 'N/A'}</div></div>
        </div>
        <div class="footer">Generated by RevWorkforce HRM | ${new Date().toLocaleString('en-IN')}</div>
      </body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  }

  downloadExcel(): void {
    if (!this.profile) return;
    const p = this.profile;
    const rows = [
      ['Field', 'Value'],
      ['Full Name', `${p.firstName} ${p.lastName}`],
      ['Employee ID', p.employeeId],
      ['Email', p.email],
      ['Phone', p.phone || 'N/A'],
      ['Department', p.departmentName || 'N/A'],
      ['Designation', p.designationName || 'N/A'],
      ['Role', p.role],
      ['Status', p.status],
      ['Joining Date', p.joiningDate ? new Date(p.joiningDate).toLocaleDateString('en-IN') : 'N/A'],
      ['Salary', p.salary ? `₹${Number(p.salary).toLocaleString('en-IN')}` : 'N/A'],
      ['Address', p.address || 'N/A'],
    ];
    const csv = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Manager_${p.employeeId}_Report.csv`;
    a.click();
  }
}
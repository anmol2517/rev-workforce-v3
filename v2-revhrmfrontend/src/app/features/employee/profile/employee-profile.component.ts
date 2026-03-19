import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmployeeService } from '../../../core/services/employee.service';

declare const window: any;

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>My Profile</h1></div>
      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <div *ngIf="profile && !loading" style="display:grid;grid-template-columns:300px 1fr;gap:24px">

        <!-- LEFT card -->
        <div class="card" style="padding:24px;text-align:center">
          <div style="margin:0 auto 14px;width:110px;height:110px;display:flex;align-items:center;justify-content:center;border:2px solid #ce93d8;border-radius:12px;background:#faf4ff">
            <img id="emp-qrcode-img" width="96" height="96" style="display:block" />
          </div>
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#4a148c,#7b1fa2);color:#fff;font-size:26px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
            {{ profile.firstName?.charAt(0) }}{{ profile.lastName?.charAt(0) }}
          </div>
          <h2 style="font-size:18px;font-weight:700;color:#1a1a2e;margin-bottom:4px">{{ profile.firstName }} {{ profile.lastName }}</h2>
          <p style="color:#888;font-size:13px;margin-bottom:8px">{{ profile.employeeId }}</p>
          <span [style.background]="profile.status==='Working'?'#e8f5e9':'#fce4ec'"
            [style.color]="profile.status==='Working'?'#2e7d32':'#c62828'"
            style="padding:4px 14px;border-radius:12px;font-size:12px;font-weight:600;display:inline-block">
            {{ profile.status }}
          </span>
          <div style="margin-top:16px;text-align:left;border-top:1px solid #f0f0f0;padding-top:14px">
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:#7b1fa2">email</mat-icon>{{ profile.email }}
            </p>
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:#7b1fa2">business</mat-icon>{{ profile.departmentName || 'N/A' }}
            </p>
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:#7b1fa2">badge</mat-icon>{{ profile.designationName || 'N/A' }}
            </p>
            <p *ngIf="profile.phone" style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:#7b1fa2">phone</mat-icon>{{ profile.phone }}
            </p>
            <p *ngIf="profile.joiningDate" style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:#7b1fa2">calendar_today</mat-icon>
              Joined: {{ profile.joiningDate | date:'dd MMM yyyy' }}
            </p>
            <p *ngIf="profile.managerName" style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:#7b1fa2">manage_accounts</mat-icon>
              Reports to: {{ profile.managerName }}
            </p>
          </div>
        </div>

        <!-- RIGHT -->
        <div style="display:flex;flex-direction:column;gap:20px">

          <!-- Employment Details -->
          <div class="card" style="padding:24px">
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
              <div style="padding:14px;background:#f3e5f5;border-radius:10px">
                <div style="font-size:11px;color:#4a148c;margin-bottom:5px">Salary</div>
                <div style="font-weight:700;color:#4a148c">₹ {{ profile.salary | number }}</div>
              </div>
              <div style="padding:14px;background:#e8eaf6;border-radius:10px">
                <div style="font-size:11px;color:#3949ab;margin-bottom:5px">Status</div>
                <div style="font-weight:700;color:#1a237e">{{ profile.status }}</div>
              </div>
              <div *ngIf="profile.address" style="padding:14px;background:#f8f9fa;border-radius:10px;grid-column:span 2">
                <div style="font-size:11px;color:#888;margin-bottom:5px">Address</div>
                <div style="font-weight:600;color:#1a1a2e;font-size:13px">{{ profile.address }}</div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div *ngIf="!editMode" class="card" style="padding:20px">
            <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:16px">Actions</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <button mat-flat-button (click)="startEdit()" style="background:#4a148c;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>edit</mat-icon> Edit Profile
              </button>
              <button mat-flat-button (click)="downloadPdf()" style="background:#b71c1c;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>picture_as_pdf</mat-icon> Download PDF
              </button>
              <button mat-flat-button (click)="downloadExcel()" style="background:#2e7d32;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>table_view</mat-icon> Download Excel
              </button>
              <button mat-flat-button (click)="downloadQr()" style="background:#6a1b9a;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>qr_code_2</mat-icon> Download QR
              </button>
            </div>
          </div>

          <!-- Edit Form — sends ALL required fields -->
          <div *ngIf="editMode" class="card" style="padding:24px;border-left:4px solid #4a148c">
            <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:4px">Edit Profile</h3>
            <p style="font-size:12px;color:#888;margin-bottom:20px">You can update your name, phone number and address.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
              <mat-form-field appearance="outline">
                <mat-label>First Name *</mat-label>
                <input matInput [(ngModel)]="editData.firstName" placeholder="First Name" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Last Name *</mat-label>
                <input matInput [(ngModel)]="editData.lastName" placeholder="Last Name" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Phone Number</mat-label>
                <input matInput [(ngModel)]="editData.phone" placeholder="+91 XXXXX XXXXX" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Address</mat-label>
                <input matInput [(ngModel)]="editData.address" placeholder="Your address" />
              </mat-form-field>
            </div>
            <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
              <button mat-button (click)="editMode=false">Cancel</button>
              <button mat-flat-button (click)="saveProfile()" [disabled]="saving || !editData.firstName?.trim() || !editData.lastName?.trim()"
                style="background:#4a148c;color:#fff">
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class EmployeeProfileComponent implements OnInit {
  profile: any = null;
  loading = true;
  saving = false;
  editMode = false;
  editData: any = {};

  constructor(private employeeService: EmployeeService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.employeeService.getProfile().subscribe({
      next: (d: any) => {
        this.profile = d;
        this.loading = false;
        setTimeout(() => this.generateQr(), 300);
      },
      error: () => { this.loading = false; }
    });
  }

  startEdit(): void {
    // Pre-fill all fields that backend accepts
    this.editData = {
      firstName: this.profile?.firstName || '',
      lastName: this.profile?.lastName || '',
      phone: this.profile?.phone || '',
      address: this.profile?.address || ''
    };
    this.editMode = true;
  }

  generateQr(): void {
    const el = document.getElementById('emp-qrcode-img') as HTMLImageElement;
    if (!el || !this.profile) return;
    const data = `EMP:${this.profile.employeeId}|${this.profile.firstName} ${this.profile.lastName}|${this.profile.departmentName||''}|${this.profile.email}`;
    el.src = `https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(data)}`;
  }

  saveProfile(): void {
    if (!this.editData.firstName?.trim() || !this.editData.lastName?.trim()) {
      this.snackBar.open('First name and last name are required','Close',{duration:2000});
      return;
    }
    this.saving = true;
    // Send all fields that backend's updateProfile() uses
    const payload = {
  phone: this.editData.phone || '',
  address: this.editData.address || ''
};
    this.employeeService.updateProfile(payload).subscribe({
      next: (d: any) => {
        const updated = d;
        if (updated && updated.firstName) {
          this.profile = { ...this.profile, ...updated };
        } else {
          // Merge manually if response incomplete
          this.profile = { ...this.profile, ...payload };
        }
        this.saving = false;
        this.editMode = false;
        this.snackBar.open('Profile updated successfully!','Close',{duration:2500});
        setTimeout(() => this.generateQr(), 300);
      },
      error: (err: any) => {
        this.saving = false;
        const msg = err?.error?.message || 'Error updating profile';
        this.snackBar.open(msg,'Close',{duration:3000});
      }
    });
  }

  downloadQr(): void {
    if (!this.profile) return;
    const data = `EMP:${this.profile.employeeId}|${this.profile.firstName} ${this.profile.lastName}|${this.profile.departmentName||''}|${this.profile.email}`;
    const a = document.createElement('a');
    a.href = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
    a.download = `QR_${this.profile.employeeId}.png`;
    a.target = '_blank';
    a.click();
  }

  downloadPdf(): void {
    if (!this.profile) return;
    const e = this.profile;
    const html = `<html><head><title>Employee Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:32px;color:#222}
      h1{color:#4a148c;border-bottom:2px solid #4a148c;padding-bottom:8px;margin-bottom:20px}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
      .box{padding:14px;background:#f5f5f5;border-radius:8px}
      .label{font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px}
      .value{font-weight:700;color:#1a1a2e;font-size:15px}
      .footer{margin-top:40px;font-size:11px;color:#aaa;border-top:1px solid #eee;padding-top:12px}
    </style></head><body>
    <h1>Employee Profile — RevWorkforce HRM</h1>
    <div class="grid">
      <div class="box"><div class="label">Full Name</div><div class="value">${e.firstName} ${e.lastName}</div></div>
      <div class="box"><div class="label">Employee ID</div><div class="value">${e.employeeId}</div></div>
      <div class="box"><div class="label">Email</div><div class="value">${e.email}</div></div>
      <div class="box"><div class="label">Phone</div><div class="value">${e.phone||'N/A'}</div></div>
      <div class="box"><div class="label">Department</div><div class="value">${e.departmentName||'N/A'}</div></div>
      <div class="box"><div class="label">Designation</div><div class="value">${e.designationName||'N/A'}</div></div>
      <div class="box"><div class="label">Joining Date</div><div class="value">${e.joiningDate?new Date(e.joiningDate).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}):'N/A'}</div></div>
      <div class="box"><div class="label">Status</div><div class="value">${e.status}</div></div>
      <div class="box"><div class="label">Reports To</div><div class="value">${e.managerName||'N/A'}</div></div>
      <div class="box"><div class="label">Salary</div><div class="value">₹ ${e.salary||'N/A'}</div></div>
      <div class="box" style="grid-column:span 2"><div class="label">Address</div><div class="value">${e.address||'N/A'}</div></div>
    </div>
    <div class="footer">Generated by RevWorkforce HRM &nbsp;|&nbsp; ${new Date().toLocaleString('en-IN')}</div>
    </body></html>`;
    const w = window.open('','_blank');
    if (!w) return;
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(()=>{ w.print(); w.close(); }, 500);
  }

  downloadExcel(): void {
    if (!this.profile) return;
    const e = this.profile;
    const rows = [
      ['Field','Value'],
      ['Full Name',`${e.firstName} ${e.lastName}`],
      ['Employee ID', e.employeeId],
      ['Email', e.email],
      ['Phone', e.phone||'N/A'],
      ['Department', e.departmentName||'N/A'],
      ['Designation', e.designationName||'N/A'],
      ['Role', e.role],
      ['Status', e.status],
      ['Joining Date', e.joiningDate?new Date(e.joiningDate).toLocaleDateString('en-IN'):'N/A'],
      ['Reports To', e.managerName||'N/A'],
      ['Salary', `Rs. ${e.salary||'N/A'}`],
      ['Address', e.address||'N/A']
    ];
    const csv = rows.map(r=>r.map(c=>`"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Employee_${e.employeeId}_Report.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ManagerService } from '../../../core/services/manager.service';
import { User } from '../../../core/models/models';

@Component({
  selector: 'app-manager-view-employee',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="page-container">
      <div class="page-header" style="display:flex;align-items:center;gap:12px">
        <button mat-icon-button (click)="back()"><mat-icon>arrow_back</mat-icon></button>
        <h1>Employee Profile</h1>
        <span style="margin-left:auto;color:#f44336;font-size:13px;background:#fce4ec;padding:4px 12px;border-radius:12px;font-weight:600">
          🔒 Read Only
        </span>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <div *ngIf="!loading && !employee" class="empty-state">
        <mat-icon>error_outline</mat-icon>
        <p>Employee not found or not in your team</p>
        <button mat-flat-button (click)="back()" style="background:#1b5e20;color:#fff;margin-top:12px">Go Back</button>
      </div>

      <div *ngIf="employee && !loading" style="display:grid;grid-template-columns:300px 1fr;gap:24px">

        <!-- LEFT CARD -->
        <div class="card" style="padding:24px;text-align:center">
          <!-- QR Code -->
          <div style="margin:0 auto 14px;width:110px;height:110px;display:flex;align-items:center;justify-content:center;border:2px solid #c8e6c9;border-radius:12px;background:#f9fff9">
            <div id="qrcode" style="width:96px;height:96px"></div>
          </div>

          <!-- Avatar -->
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#1b5e20,#2e7d32);color:#fff;font-size:26px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
            {{ employee.firstName.charAt(0) }}{{ employee.lastName.charAt(0) }}
          </div>
          <h2 style="font-size:18px;font-weight:700;color:#1a1a2e;margin-bottom:4px">
            {{ employee.firstName }} {{ employee.lastName }}
          </h2>
          <p style="color:#888;font-size:13px;margin-bottom:8px">{{ employee.employeeId }}</p>
          <span class="status-chip APPROVED" style="display:inline-block">{{ employee.status }}</span>

          <!-- Contact Info -->
          <div style="margin-top:16px;text-align:left;border-top:1px solid #f0f0f0;padding-top:14px">
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">email</mat-icon>{{ employee.email }}
            </p>
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">business</mat-icon>{{ employee.departmentName || 'N/A' }}
            </p>
            <p style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">badge</mat-icon>{{ employee.designationName || 'N/A' }}
            </p>
            <p *ngIf="employee.phone" style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">phone</mat-icon>{{ employee.phone }}
            </p>
            <p *ngIf="employee.joiningDate" style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">calendar_today</mat-icon>
              Joined: {{ employee.joiningDate | date:'dd MMM yyyy' }}
            </p>
            <p *ngIf="employee.address" style="display:flex;align-items:center;gap:8px;color:#555;font-size:13px;margin:8px 0">
              <mat-icon style="font-size:16px;width:16px;height:16px">location_on</mat-icon>{{ employee.address }}
            </p>
          </div>
        </div>
        <!-- END LEFT CARD -->

        <!-- RIGHT SIDE -->
        <div style="display:flex;flex-direction:column;gap:20px">

          <!-- Employment Details -->
          <div class="card" style="padding:24px">
            <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:20px">Employment Details</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
              <div style="padding:14px;background:#f8f9fa;border-radius:10px">
                <div style="font-size:11px;color:#888;margin-bottom:5px">Employee ID</div>
                <div style="font-weight:700;color:#1a1a2e">{{ employee.employeeId }}</div>
              </div>
              <div style="padding:14px;background:#f8f9fa;border-radius:10px">
                <div style="font-size:11px;color:#888;margin-bottom:5px">Role</div>
                <div style="font-weight:700;color:#1a1a2e">{{ employee.role }}</div>
              </div>
              <div style="padding:14px;background:#f8f9fa;border-radius:10px">
                <div style="font-size:11px;color:#888;margin-bottom:5px">Department</div>
                <div style="font-weight:700;color:#1a1a2e">{{ employee.departmentName || 'N/A' }}</div>
              </div>
              <div style="padding:14px;background:#f8f9fa;border-radius:10px">
                <div style="font-size:11px;color:#888;margin-bottom:5px">Designation</div>
                <div style="font-weight:700;color:#1a1a2e">{{ employee.designationName || 'N/A' }}</div>
              </div>
              <div style="padding:14px;background:#e8eaf6;border-radius:10px">
                <div style="font-size:11px;color:#3949ab;margin-bottom:5px">Status</div>
                <div style="font-weight:700;color:#1a237e">{{ employee.status }}</div>
              </div>
              <div *ngIf="employee.managerName" style="padding:14px;background:#e8f5e9;border-radius:10px">
                <div style="font-size:11px;color:#388e3c;margin-bottom:5px">Reports To</div>
                <div style="font-weight:700;color:#2e7d32">{{ employee.managerName }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons — status ke niche, same as manager profile -->
          <div class="card" style="padding:20px">
            <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:16px">Actions</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <button mat-flat-button (click)="downloadPdf()"
                style="background:#b71c1c;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>picture_as_pdf</mat-icon> Download PDF
              </button>
              <button mat-flat-button (click)="downloadExcel()"
                style="background:#2e7d32;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0">
                <mat-icon>table_view</mat-icon> Download Excel
              </button>
              <button mat-flat-button (click)="downloadQr()"
                style="background:#1565c0;color:#fff;display:flex;align-items:center;gap:6px;justify-content:center;padding:10px 0;grid-column:span 2">
                <mat-icon>qr_code_2</mat-icon> Download QR Code
              </button>
            </div>
          </div>

          <!-- Read Only Notice -->
          <div style="padding:16px;background:#fff3e0;border-radius:10px;display:flex;align-items:center;gap:10px;border-left:4px solid #ff9800">
            <mat-icon style="color:#f57c00">info</mat-icon>
            <div>
              <div style="font-weight:600;color:#e65100;font-size:14px">View Only Mode</div>
              <div style="font-size:13px;color:#bf360c">You can view this employee's profile but cannot edit it. Only the employee or admin can make changes.</div>
            </div>
          </div>

        </div>
        <!-- END RIGHT SIDE -->

      </div>
    </div>
  `
})
export class ManagerViewEmployeeComponent implements OnInit {
  employee: User | null = null;
  loading = true;
  private employeeId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.managerService.getTeamMembers().subscribe({
      next: (team: any) => {
        const list: User[] = Array.isArray(team) ? team : (team?.data || []);
        const found = list.find(e => e.employeeId === this.employeeId);
        if (found) {
          this.employee = found;
          setTimeout(() => this.generateQr(), 300);
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  generateQr(): void {
    const el = document.getElementById('qrcode');
    if (!el || !this.employee) return;
    el.innerHTML = '';
    const data = `EMP:${this.employee.employeeId}|NAME:${this.employee.firstName} ${this.employee.lastName}|DEPT:${this.employee.departmentName || ''}|EMAIL:${this.employee.email}`;
    const img = document.createElement('img');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(data)}`;
    img.style.width = '96px';
    img.style.height = '96px';
    el.appendChild(img);
  }

  downloadQr(): void {
    if (!this.employee) return;
    const data = `EMP:${this.employee.employeeId}|NAME:${this.employee.firstName} ${this.employee.lastName}|DEPT:${this.employee.departmentName || ''}|EMAIL:${this.employee.email}`;
    const a = document.createElement('a');
    a.href = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
    a.target = '_blank';
    a.download = `QR_${this.employee.employeeId}.png`;
    a.click();
  }

  downloadPdf(): void {
    if (!this.employee) return;
    const e = this.employee;
    const html = `<html><head><title>Employee Report</title>
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
        <h1>Employee Profile Report</h1>
        <span class="badge">${e.status}</span><span class="badge">${e.role}</span>
        <div class="grid">
          <div class="box"><div class="label">Full Name</div><div class="value">${e.firstName} ${e.lastName}</div></div>
          <div class="box"><div class="label">Employee ID</div><div class="value">${e.employeeId}</div></div>
          <div class="box"><div class="label">Email</div><div class="value">${e.email}</div></div>
          <div class="box"><div class="label">Phone</div><div class="value">${e.phone || 'N/A'}</div></div>
          <div class="box"><div class="label">Department</div><div class="value">${e.departmentName || 'N/A'}</div></div>
          <div class="box"><div class="label">Designation</div><div class="value">${e.designationName || 'N/A'}</div></div>
          <div class="box"><div class="label">Joining Date</div><div class="value">${e.joiningDate ? new Date(e.joiningDate).toLocaleDateString('en-IN', {day:'2-digit',month:'long',year:'numeric'}) : 'N/A'}</div></div>
          <div class="box"><div class="label">Reports To</div><div class="value">${e.managerName || 'N/A'}</div></div>
          <div class="box" style="grid-column:span 2"><div class="label">Address</div><div class="value">${e.address || 'N/A'}</div></div>
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
    if (!this.employee) return;
    const e = this.employee;
    const rows = [
      ['Field', 'Value'],
      ['Full Name', `${e.firstName} ${e.lastName}`],
      ['Employee ID', e.employeeId],
      ['Email', e.email],
      ['Phone', e.phone || 'N/A'],
      ['Department', e.departmentName || 'N/A'],
      ['Designation', e.designationName || 'N/A'],
      ['Role', e.role],
      ['Status', e.status],
      ['Joining Date', e.joiningDate ? new Date(e.joiningDate).toLocaleDateString('en-IN') : 'N/A'],
      ['Reports To', e.managerName || 'N/A'],
      ['Address', e.address || 'N/A'],
    ];
    const csv = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Employee_${e.employeeId}_Report.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  back(): void { this.router.navigate(['/manager/team']); }
}
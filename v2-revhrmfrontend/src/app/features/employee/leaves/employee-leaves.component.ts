import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../../../core/services/employee.service';
import { LeaveService } from '../../../core/services/leave.service';

@Component({
  selector: 'app-employee-leaves',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTabsModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>My Leaves</h1></div>
      <mat-tab-group>

        <mat-tab label="Leave Balance">
          <div style="margin-top:20px">
            <div *ngIf="leaveBalance.length===0" class="empty-state">
              <mat-icon>beach_access</mat-icon><p>No leave balance data</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
              <div *ngFor="let lb of leaveBalance" class="card" style="padding:20px;border-left:4px solid #4a148c">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
                  <span style="font-size:17px;font-weight:700;color:#1a1a2e">{{ formatLeaveType(lb.leaveType) }}</span>
                  <span>
                    <span style="font-size:26px;font-weight:800;color:#4a148c">{{ lb.remainingDays || lb.remaining }}</span>
                    <span style="font-size:13px;color:#aaa;font-weight:400"> left</span>
                  </span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
                  <div style="padding:10px;background:#f8f9fa;border-radius:8px;text-align:center">
                    <div style="font-size:11px;color:#888;margin-bottom:3px">Total</div>
                    <div style="font-weight:700;color:#333;font-size:16px">{{ lb.totalDays || lb.total }}</div>
                  </div>
                  <div style="padding:10px;background:#fce4ec;border-radius:8px;text-align:center">
                    <div style="font-size:11px;color:#c62828;margin-bottom:3px">Used</div>
                    <div style="font-weight:700;color:#c62828;font-size:16px">{{ lb.usedDays || lb.used }}</div>
                  </div>
                  <div style="padding:10px;background:#e8f5e9;border-radius:8px;text-align:center">
                    <div style="font-size:11px;color:#2e7d32;margin-bottom:3px">Remaining</div>
                    <div style="font-weight:700;color:#2e7d32;font-size:16px">{{ lb.remainingDays || lb.remaining }}</div>
                  </div>
                </div>
                <div style="height:8px;background:#e0e0e0;border-radius:4px;overflow:hidden">
                  <div [style.width]="getUsedPct(lb)+'%'"
                    [style.background]="getUsedPct(lb)>75?'#e53935':'#4a148c'"
                    style="height:100%;border-radius:4px;transition:width 0.4s"></div>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:11px;color:#aaa">
                  <span>0</span><span>{{ getUsedPct(lb) }}% used</span><span>{{ lb.totalDays || lb.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Apply for Leave">
          <div class="card" style="margin-top:16px;max-width:600px">
            <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:20px">Apply for Leave</h3>
            <div *ngIf="leaveBalance.length>0"
              style="padding:12px;background:#f3e5f5;border-radius:8px;margin-bottom:20px">
              <div style="font-size:12px;color:#7b1fa2;font-weight:600;margin-bottom:8px">Available Balance</div>
              <div style="display:flex;gap:16px;flex-wrap:wrap">
                <span *ngFor="let lb of leaveBalance" style="font-size:13px;color:#555">
                  <strong style="color:#4a148c">{{ formatLeaveType(lb.leaveType) }}</strong>: {{ lb.remainingDays || lb.remaining }} days left
                </span>
              </div>
            </div>
            <form [formGroup]="form" (ngSubmit)="applyLeave()">
              <mat-form-field appearance="outline" style="width:100%">
                <mat-label>Leave Type *</mat-label>
                <mat-select formControlName="leaveType" (selectionChange)="calcDays()">
                  <mat-option *ngFor="let t of leaveTypes" [value]="t.leaveType || t.name">
                    {{ formatLeaveType(t.leaveType || t.name) }}
                    <span style="color:#aaa;font-size:12px"> — {{ getRemainingForType(t.leaveType || t.name) }} days available</span>
                  </mat-option>
                </mat-select>
              </mat-form-field>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                <mat-form-field appearance="outline">
                  <mat-label>Start Date *</mat-label>
                  <input matInput type="date" formControlName="startDate" [min]="today" (change)="calcDays()">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>End Date *</mat-label>
                  <input matInput type="date" formControlName="endDate" [min]="today" (change)="calcDays()">
                </mat-form-field>
              </div>
              <div *ngIf="calculatedDays>0"
                style="padding:12px;border-radius:8px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center"
                [style.background]="isBalanceSufficient()?'#e8f5e9':'#fce4ec'"
                [style.border]="isBalanceSufficient()?'1px solid #a5d6a7':'1px solid #ef9a9a'">
                <span style="font-size:14px;font-weight:600"
                  [style.color]="isBalanceSufficient()?'#2e7d32':'#c62828'">
                  {{ calculatedDays }} day(s) requested
                </span>
                <span *ngIf="!isBalanceSufficient()" style="font-size:12px;color:#c62828;font-weight:600">⚠ Insufficient balance!</span>
                <span *ngIf="isBalanceSufficient()" style="font-size:12px;color:#2e7d32;font-weight:600">✓ Balance sufficient</span>
              </div>
              <mat-form-field appearance="outline" style="width:100%">
                <mat-label>Reason *</mat-label>
                <textarea matInput formControlName="reason" rows="3" placeholder="Briefly explain reason..."></textarea>
              </mat-form-field>
              <button mat-flat-button type="submit"
                [disabled]="form.invalid || !isBalanceSufficient()"
                style="background:#4a148c;color:#fff;width:100%;padding:12px 0;border-radius:8px;font-size:15px">
                Submit Leave Application
              </button>
            </form>
          </div>
        </mat-tab>

        <mat-tab label="My Applications">
          <div style="margin-top:16px">
            <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>
            <div *ngIf="!loading && applications.length===0" class="empty-state">
              <mat-icon>event_available</mat-icon><p>No leave applications yet</p>
            </div>
            <div *ngIf="!loading && applications.length>0" class="card" style="padding:0;overflow:hidden">
              <table style="width:100%;border-collapse:collapse">
                <thead>
                  <tr style="background:#f3e5f5">
                    <th style="padding:14px 16px;text-align:left;font-size:12px;font-weight:700;color:#4a148c;text-transform:uppercase;letter-spacing:.5px">Type</th>
                    <th style="padding:14px 16px;text-align:left;font-size:12px;font-weight:700;color:#4a148c;text-transform:uppercase;letter-spacing:.5px">From</th>
                    <th style="padding:14px 16px;text-align:left;font-size:12px;font-weight:700;color:#4a148c;text-transform:uppercase;letter-spacing:.5px">To</th>
                    <th style="padding:14px 16px;text-align:center;font-size:12px;font-weight:700;color:#4a148c;text-transform:uppercase;letter-spacing:.5px">Days</th>
                    <th style="padding:14px 16px;text-align:left;font-size:12px;font-weight:700;color:#4a148c;text-transform:uppercase;letter-spacing:.5px">Reason</th>
                    <th style="padding:14px 16px;text-align:left;font-size:12px;font-weight:700;color:#4a148c;text-transform:uppercase;letter-spacing:.5px">Status</th>
                    <th style="padding:14px 16px;text-align:center;font-size:12px;font-weight:700;color:#4a148c;text-transform:uppercase;letter-spacing:.5px">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let l of applications; let i=index"
                    [style.background]="i%2===0?'#fff':'#fafafa'"
                    style="border-bottom:1px solid #f0f0f0">
                    <td style="padding:14px 16px">
                      <span style="font-weight:700;color:#1a1a2e;font-size:13px">
                        {{ formatLeaveType(l.leaveType) || '—' }}
                      </span>
                    </td>
                    <td style="padding:14px 16px;font-size:13px;color:#555;white-space:nowrap">
                      {{ l.startDate | date:'dd MMM yyyy' }}
                    </td>
                    <td style="padding:14px 16px;font-size:13px;color:#555;white-space:nowrap">
                      {{ l.endDate | date:'dd MMM yyyy' }}
                    </td>
                    <td style="padding:14px 16px;text-align:center">
                      <span style="background:#e8eaf6;color:#283593;padding:3px 10px;border-radius:12px;font-size:13px;font-weight:700">
                        {{ calcDaysCount(l.startDate, l.endDate) }}
                      </span>
                    </td>
                    <td style="padding:14px 16px;font-size:13px;color:#555;max-width:200px">
                      <div [title]="l.reason" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                        {{ l.reason }}
                      </div>
                      <div *ngIf="l.approvalComment && l.approvalComment.trim()"
                        style="font-size:11px;color:#7b1fa2;margin-top:3px;display:flex;align-items:center;gap:3px">
                        <mat-icon style="font-size:11px;width:11px;height:11px">comment</mat-icon>
                        {{ l.approvalComment }}
                      </div>
                    </td>
                    <td style="padding:14px 16px;white-space:nowrap">
                      <span class="status-chip" [class]="l.status">{{ l.status }}</span>
                    </td>
                    <td style="padding:14px 16px;text-align:center">
                      <button *ngIf="l.status==='PENDING'" mat-stroked-button (click)="cancel(l.leaveId)"
                        style="color:#c62828;border-color:#c62828;font-size:12px;padding:4px 12px;min-width:0"
                        matTooltip="Cancel this leave">
                        <mat-icon style="font-size:14px;width:14px;height:14px">cancel</mat-icon> Cancel
                      </button>
                      <span *ngIf="l.status!=='PENDING'" style="font-size:12px;color:#aaa">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Holidays">
          <div style="margin-top:16px">
            <div *ngIf="holidays.length===0" class="empty-state">
              <mat-icon>celebration</mat-icon><p>No holidays listed</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">
              <div *ngFor="let h of holidays" class="card"
                style="padding:18px;border-left:5px solid"
                [style.border-left-color]="h.type==='OPTIONAL'?'#f57f17':'#2e7d32'">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
                  <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0"
                    [style.background]="h.type==='OPTIONAL'?'#fff8e1':'#e8f5e9'">
                    <mat-icon [style.color]="h.type==='OPTIONAL'?'#f57f17':'#2e7d32'" style="font-size:20px">celebration</mat-icon>
                  </div>
                  <span [style.background]="h.type==='OPTIONAL'?'#fff8e1':'#e8f5e9'"
                    [style.color]="h.type==='OPTIONAL'?'#f57f17':'#2e7d32'"
                    style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700">
                    {{ h.type==='OPTIONAL' ? 'Optional' : 'Mandatory' }}
                  </span>
                </div>
                <div style="font-weight:700;color:#1a1a2e;font-size:15px;margin-bottom:4px">{{ h.name }}</div>
                <div style="font-size:12px;color:#666;margin-bottom:4px;display:flex;align-items:center;gap:4px">
                  <mat-icon style="font-size:13px;width:13px;height:13px;color:#888">event</mat-icon>
                  {{ h.date | date:'EEEE, dd MMMM yyyy' }}
                </div>
                <div *ngIf="h.description" style="font-size:12px;color:#aaa;margin-top:4px">{{ h.description }}</div>
              </div>
            </div>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `
})
export class EmployeeLeavesComponent implements OnInit {
  leaveBalance: any[] = [];
  leaveTypes: any[] = [];
  applications: any[] = [];
  holidays: any[] = [];
  loading = true;
  calculatedDays = 0;
  today = new Date().toISOString().split('T')[0];
  form!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    setTimeout(() => { this.loading = false; }, 8000);
    this.employeeService.getLeaveBalance().subscribe({
      next: (d: any) => {
        this.leaveBalance = Array.isArray(d) ? d : [];
      },
      error: () => {}
    });
    this.leaveService.getLeaveTypes().subscribe({
      next: (d: any) => {
        this.leaveTypes = Array.isArray(d) ? d : [];
      },
      error: () => {}
    });
    this.employeeService.getHolidays().subscribe({
      next: (d: any) => {
        this.holidays = Array.isArray(d) ? d : [];
      },
      error: () => {}
    });
    this.loadApplications();
    this.form = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate:   ['', Validators.required],
      reason:    ['', Validators.required]
    });
  }

  loadApplications(): void {
    this.loading = true;
    this.employeeService.getMyLeaves().subscribe({
      next: (d: any) => {
        this.applications = Array.isArray(d) ? d : (d?.content || []);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  calcDays(): void {
    const s = this.form.get('startDate')?.value;
    const e = this.form.get('endDate')?.value;
    if (s && e) {
      const diff = Math.ceil((new Date(e).getTime() - new Date(s).getTime()) / 86400000) + 1;
      this.calculatedDays = diff > 0 ? diff : 0;
    } else {
      this.calculatedDays = 0;
    }
  }

  calcDaysCount(start: string, end: string): number {
    if (!start || !end) return 0;
    const diff = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1;
    return diff > 0 ? diff : 0;
  }

  formatLeaveType(type: string): string {
    if (!type) return '';
    return type.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  getRemainingForType(typeName: string): number {
    const lb = this.leaveBalance.find((b: any) =>
      (b.leaveType || '').toLowerCase() === (typeName || '').toLowerCase()
    );
    return lb?.remainingDays ?? lb?.remaining ?? 0;
  }

  isBalanceSufficient(): boolean {
    if (this.calculatedDays === 0) return true;
    const typeName = this.form.get('leaveType')?.value;
    if (!typeName) return true;
    return this.getRemainingForType(typeName) >= this.calculatedDays;
  }

  getUsedPct(lb: any): number {
    const total = lb.totalDays || lb.total || 0;
    const used  = lb.usedDays  || lb.used  || 0;
    if (!total) return 0;
    return Math.round((used / total) * 100);
  }

  applyLeave(): void {
    if (this.form.invalid) return;
    const formVal = this.form.value;
    const payload = {
      leaveType: formVal.leaveType,
      startDate: formVal.startDate,
      endDate:   formVal.endDate,
      reason:    formVal.reason
    };
    this.employeeService.applyLeave(payload).subscribe({
      next: () => {
        this.form.reset();
        this.calculatedDays = 0;
        this.loadApplications();
        this.employeeService.getLeaveBalance().subscribe({
          next: (d: any) => {
            this.leaveBalance = Array.isArray(d) ? d : [];
          }
        });
        this.snackBar.open('Leave applied successfully!', 'Close', { duration: 2500 });
      },
      error: () => this.snackBar.open('Error applying leave', 'Close', { duration: 2000 })
    });
  }

  cancel(id: number): void {
    this.employeeService.cancelLeave(id).subscribe({
      next: () => {
        this.loadApplications();
        this.snackBar.open('Leave cancelled', 'Close', { duration: 2000 });
      }
    });
  }
}
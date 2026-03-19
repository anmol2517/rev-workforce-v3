import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { Goal } from '../../../core/models/models';

@Component({
  selector: 'app-employee-goals',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTabsModule, MatProgressBarModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>My Goals</h1>
        <span style="background:#e8f5e9;color:#2e7d32;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
          {{ statusGoals.length }} staus
        </span>
      </div>

      <mat-tab-group>

        <!-- TAB 1: Goals List -->
        <mat-tab label="Goals List">
          <div style="margin-top:16px">
            <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

            <div *ngIf="!loading && allGoals.length === 0" class="empty-state">
              <mat-icon>flag</mat-icon>
              <p>No goals yet</p>
              <p style="font-size:13px;color:#aaa">Create a goal or wait for manager to assign one</p>
            </div>

            <!-- staus Goals -->
            <div *ngFor="let g of statusGoals" class="card" style="margin-bottom:14px;padding:20px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
                <div style="flex:1;min-width:200px">
                  <p style="font-weight:700;color:#1a1a2e;font-size:15px;margin:0 0 8px">
                    {{ g.description || g.title }}
                  </p>
                  <div style="font-size:12px;color:#888;margin-bottom:12px;display:flex;align-items:center;gap:4px">
                    <mat-icon style="font-size:14px;width:14px;height:14px">event</mat-icon>
                    Deadline: {{ g.deadline | date:'dd MMM yyyy' }}
                  </div>

                  <div style="margin-bottom:12px">
                    <div style="display:flex;justify-content:space-between;font-size:12px;color:#555;margin-bottom:4px">
                      <span>Progress</span>
                      <span style="font-weight:600">{{ g.progressPercent || 0 }}%</span>
                    </div>
                    <mat-progress-bar mode="determinate"
                      [value]="g.progressPercent || 0"
                      [color]="(g.progressPercent || 0) >= 100 ? 'primary' : 'accent'">
                    </mat-progress-bar>
                  </div>

                  <div *ngIf="g.managerComments"
                    style="padding:10px;background:#f0f7ff;border-radius:8px;border-left:3px solid #1565c0">
                    <div style="font-size:11px;color:#1565c0;font-weight:600;margin-bottom:3px">Manager Comment</div>
                    <div style="font-size:13px;color:#555">{{ g.managerComments }}</div>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
                  <span class="status-chip" [class]="getStatusClass(g.status)">
                    {{ getStatusLabel(g.status) }}
                  </span>
                  <span [style.background]="getPriorityBg(g.priority)"
                    [style.color]="getPriorityColor(g.priority)"
                    style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600">
                    {{ g.priority }} Priority
                  </span>
                  <button mat-stroked-button (click)="openProgress(g)"
                    style="color:#1565c0;border-color:#1565c0;font-size:12px;margin-top:4px">
                    <mat-icon style="font-size:16px">update</mat-icon> Update Progress
                  </button>
                </div>
              </div>
            </div>

            <!-- History Section -->
            <div *ngIf="historyGoals.length > 0" style="margin-top:28px">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;cursor:pointer"
                (click)="showHistory = !showHistory">
                <div style="flex:1;height:1px;background:#e0e0e0"></div>
                <div style="display:flex;align-items:center;gap:8px;padding:8px 16px;background:#f5f5f5;border-radius:20px;white-space:nowrap">
                  <mat-icon style="font-size:18px;width:18px;height:18px;color:#888">history</mat-icon>
                  <span style="font-size:13px;font-weight:600;color:#666">
                    Past Goals ({{ historyGoals.length }})
                  </span>
                  <mat-icon style="font-size:16px;width:16px;height:16px;color:#888">
                    {{ showHistory ? 'expand_less' : 'expand_more' }}
                  </mat-icon>
                </div>
                <div style="flex:1;height:1px;background:#e0e0e0"></div>
              </div>

              <div *ngIf="showHistory">
                <div *ngFor="let g of historyGoals" class="card"
                  style="margin-bottom:10px;padding:16px;opacity:0.8;border-left:4px solid"
                  [style.border-left-color]="g.status === 'COMPLETED' ? '#2e7d32' : '#bbb'">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
                    <div style="flex:1">
                      <p style="font-weight:600;color:#555;font-size:14px;margin:0 0 6px">
                        {{ g.description || g.title }}
                      </p>
                      <div style="font-size:11px;color:#aaa;margin-bottom:8px">
                        Deadline: {{ g.deadline | date:'dd MMM yyyy' }}
                        <span *ngIf="g.progressPercent !== null && g.progressPercent !== undefined">
                          &nbsp;·&nbsp; Progress: {{ g.progressPercent }}%
                        </span>
                      </div>
                      <div *ngIf="g.managerComments"
                        style="padding:8px;background:#f9f9f9;border-radius:6px;font-size:12px;color:#888">
                        <span style="font-weight:600">Manager: </span>{{ g.managerComments }}
                      </div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
                      <span class="status-chip" [class]="getStatusClass(g.status)">
                        {{ getStatusLabel(g.status) }}
                      </span>
                      <span [style.background]="getPriorityBg(g.priority)"
                        [style.color]="getPriorityColor(g.priority)"
                        style="padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600">
                        {{ g.priority }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- TAB 2: Create Goal -->
        <mat-tab label="Create Goal">
          <div class="card" style="margin-top:16px;max-width:580px">
            <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:6px">Set a New Goal</h3>
            <p style="font-size:13px;color:#888;margin-bottom:20px">
              "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।" — Bhagavad Gita 6.5
            </p>
            <form [formGroup]="goalForm" (ngSubmit)="createGoal()">
              <mat-form-field appearance="outline" style="width:100%">
                <mat-label>Goal Description *</mat-label>
                <textarea matInput formControlName="description" rows="3"
                  placeholder="Describe your goal clearly and specifically..."></textarea>
              </mat-form-field>
              <mat-form-field appearance="outline" style="width:100%">
                <mat-label>Deadline *</mat-label>
                <input matInput type="date" formControlName="deadline" [min]="today">
              </mat-form-field>
              <mat-form-field appearance="outline" style="width:100%">
                <mat-label>Priority *</mat-label>
                <mat-select formControlName="priority">
                  <mat-option value="HIGH">🔴 High</mat-option>
                  <mat-option value="MEDIUM">🟡 Medium</mat-option>
                  <mat-option value="LOW">🟢 Low</mat-option>
                </mat-select>
              </mat-form-field>
              <button mat-flat-button type="submit" [disabled]="goalForm.invalid || creating"
                style="background:#2e7d32;color:#fff;width:100%;padding:12px 0">
                {{ creating ? 'Creating...' : 'Create Goal' }}
              </button>
            </form>
          </div>
        </mat-tab>

      </mat-tab-group>

      <!-- Progress Update Overlay -->
      <div *ngIf="showProgress"
        style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:1000;display:flex;align-items:center;justify-content:center"
        (click)="closeProgress()">
        <div style="background:#fff;border-radius:16px;padding:28px;width:420px;max-width:95vw"
          (click)="$event.stopPropagation()">
          <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:20px">Update Goal Progress</h3>

          <div style="margin-bottom:16px">
            <label style="font-size:13px;color:#555;font-weight:600;display:block;margin-bottom:8px">
              Progress: {{ progressValue }}%
            </label>
            <input type="range" [(ngModel)]="progressValue" min="0" max="100" step="5"
              style="width:100%;accent-color:#1565c0">
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#aaa;margin-top:4px">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          <mat-form-field appearance="outline" style="width:100%">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="progressStatus">
              <mat-option value="NOT_STARTED">⏸ Not Started</mat-option>
              <mat-option value="IN_PROGRESS">🔄 In Progress</mat-option>
              <mat-option value="COMPLETED">✅ Completed</mat-option>
              <mat-option value="CANCELLED">❌ Cancelled</mat-option>
            </mat-select>
          </mat-form-field>

          <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px">
            <button mat-button (click)="closeProgress()">Cancel</button>
            <button mat-flat-button (click)="submitProgress()" [disabled]="updatingProgress"
              style="background:#1565c0;color:#fff">
              {{ updatingProgress ? 'Updating...' : 'Update' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeGoalsComponent implements OnInit {
  allGoals: Goal[] = [];
  statusGoals: Goal[] = [];
  historyGoals: Goal[] = [];
  loading = true;
  creating = false;
  updatingProgress = false;
  showHistory = false;
  showProgress = false;
  selectedGoalId: number | null = null;
  progressValue = 0;
  progressStatus = 'IN_PROGRESS';
  today = new Date().toISOString().split('T')[0];
  goalForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    this.loadGoals();
    this.goalForm = this.fb.group({
      description: ['', Validators.required],
      deadline: ['', Validators.required],
      priority: ['MEDIUM', Validators.required]
    });
  }

  loadGoals(): void {
    this.loading = true;
    this.employeeService.getGoals().subscribe({
      next: (d: any) => {
        this.allGoals = Array.isArray(d) ? d : [];
        this.statusGoals = this.allGoals.filter(g =>
          g.status === 'NOT_STARTED' || g.status === 'IN_PROGRESS'
        );
        this.historyGoals = this.allGoals.filter(g =>
          g.status === 'COMPLETED' || g.status === 'CANCELLED'
        );
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  createGoal(): void {
    if (this.goalForm.invalid) return;
    this.creating = true;
    this.employeeService.createGoal(this.goalForm.value).subscribe({
      next: () => {
        this.goalForm.reset({ priority: 'MEDIUM' });
        this.creating = false;
        this.loadGoals();
        this.snackBar.open('Goal created!', 'Close', { duration: 2000 });
      },
      error: () => {
        this.creating = false;
        this.snackBar.open('Error creating goal', 'Close', { duration: 2000 });
      }
    });
  }

  openProgress(g: Goal): void {
    this.selectedGoalId = g.goalId || g.employeeId || null;
    this.progressValue = g.progressPercent || 0;
    this.progressStatus = g.status;
    this.showProgress = true;
  }

  closeProgress(): void { this.showProgress = false; this.selectedGoalId = null; }

  submitProgress(): void {
    if (!this.selectedGoalId) return;
    this.updatingProgress = true;
    this.employeeService.updateGoalProgress(this.selectedGoalId, { status: this.progressStatus as any, progressPercent: this.progressValue }).subscribe({
      next: () => {
        this.updatingProgress = false;
        this.closeProgress();
        this.loadGoals();
        this.snackBar.open('Progress updated!', 'Close', { duration: 2000 });
      },
      error: () => {
        this.updatingProgress = false;
        this.snackBar.open('Error updating progress', 'Close', { duration: 2000 });
      }
    });
  }

  getStatusClass(s: string): string {
    const m: Record<string,string> = {
      'COMPLETED': 'APPROVED', 'IN_PROGRESS': 'PENDING',
      'NOT_STARTED': 'REJECTED', 'CANCELLED': 'CANCELLED'
    };
    return m[s] || 'PENDING';
  }
  getStatusLabel(s: string): string {
    const m: Record<string,string> = {
      'NOT_STARTED': '⏸ Not Started', 'IN_PROGRESS': '🔄 In Progress',
      'COMPLETED': '✅ Completed', 'CANCELLED': '❌ Cancelled'
    };
    return m[s] || s;
  }
  getPriorityBg(p: string): string { return p==='HIGH'?'#fce4ec':p==='MEDIUM'?'#fff8e1':'#e8f5e9'; }
  getPriorityColor(p: string): string { return p==='HIGH'?'#c62828':p==='MEDIUM'?'#f57f17':'#2e7d32'; }
}
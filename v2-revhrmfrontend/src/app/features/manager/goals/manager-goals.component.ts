import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ManagerService } from '../../../core/services/manager.service';
import { Goal, User } from '../../../core/models/models';

@Component({
  selector: 'app-manager-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Team Goals</h1>
        <button mat-flat-button (click)="showCreateForm = !showCreateForm"
          style="background:#1b5e20;color:#fff;display:flex;align-items:center;gap:6px">
          <mat-icon>{{ showCreateForm ? 'close' : 'add' }}</mat-icon>
          {{ showCreateForm ? 'Cancel' : 'Assign Goal' }}
        </button>
      </div>

      <!-- Assign Goal Form -->
      <div *ngIf="showCreateForm" class="card" style="padding:24px;margin-bottom:24px;border-left:4px solid #1b5e20">
        <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:20px;display:flex;align-items:center;gap:8px">
          <mat-icon style="color:#1b5e20">flag</mat-icon> Assign New Goal to Team Member
        </h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <mat-form-field appearance="outline" style="grid-column:span 2">
            <mat-label>Assign To Employee *</mat-label>
            <mat-select [(ngModel)]="newGoal.employeeId">
              <mat-option *ngFor="let m of teamMembers" [value]="m.employeeId || m.employeeId">
                {{ m.firstName }} {{ m.lastName }}
                <span style="color:#aaa;font-size:12px"> — {{ m.designationName || m.employeeId }}</span>
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" style="grid-column:span 2">
            <mat-label>Goal Description *</mat-label>
            <textarea matInput [(ngModel)]="newGoal.description" rows="3"
              placeholder="Describe the goal clearly — what needs to be achieved..."></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Deadline *</mat-label>
            <input matInput type="date" [(ngModel)]="newGoal.deadline" [min]="today" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priority *</mat-label>
            <mat-select [(ngModel)]="newGoal.priority">
              <mat-option value="LOW">🟢 Low</mat-option>
              <mat-option value="MEDIUM">🟡 Medium</mat-option>
              <mat-option value="HIGH">🔴 High</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div *ngIf="newGoal.employeeId"
          style="margin-top:12px;padding:12px;background:#e8f5e9;border-radius:8px;display:flex;align-items:center;gap:10px">
          <mat-icon style="color:#2e7d32">person_check</mat-icon>
          <span style="font-size:13px;color:#2e7d32;font-weight:600">Assigning to: {{ getSelectedEmployeeName() }}</span>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
          <button mat-button (click)="resetForm()">Cancel</button>
          <button mat-flat-button (click)="createGoal()"
            [disabled]="!newGoal.employeeId || !newGoal.description.trim() || !newGoal.deadline || creating"
            style="background:#1b5e20;color:#fff;display:flex;align-items:center;gap:6px">
            <mat-icon>check</mat-icon> {{ creating ? 'Assigning...' : 'Assign Goal' }}
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px">
        <div style="padding:16px;background:#e8eaf6;border-radius:12px;text-align:center">
          <div style="font-size:26px;font-weight:800;color:#1a237e">{{ allGoals.length }}</div>
          <div style="font-size:12px;color:#3949ab;font-weight:600">Total</div>
        </div>
        <div style="padding:16px;background:#fff8e1;border-radius:12px;text-align:center">
          <div style="font-size:26px;font-weight:800;color:#f57f17">{{ count('IN_PROGRESS') }}</div>
          <div style="font-size:12px;color:#f9a825;font-weight:600">In Progress</div>
        </div>
        <div style="padding:16px;background:#e8f5e9;border-radius:12px;text-align:center">
          <div style="font-size:26px;font-weight:800;color:#2e7d32">{{ count('COMPLETED') }}</div>
          <div style="font-size:12px;color:#388e3c;font-weight:600">Completed</div>
        </div>
        <div style="padding:16px;background:#fce4ec;border-radius:12px;text-align:center">
          <div style="font-size:26px;font-weight:800;color:#c62828">{{ count('NOT_STARTED') }}</div>
          <div style="font-size:12px;color:#e53935;font-weight:600">Not Started</div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <!-- ===== staus GOALS ===== -->
      <div *ngIf="stausGoals.length > 0">
        <h2 style="font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <mat-icon style="color:#1b5e20">radio_button_checked</mat-icon>
          staus Goals <span style="font-size:13px;color:#888;font-weight:400">({{ stausGoals.length }})</span>
        </h2>
        <div *ngFor="let g of stausGoals" class="card" style="margin-bottom:12px;padding:20px">
          <ng-container *ngTemplateOutlet="goalCard; context:{g:g}"></ng-container>
        </div>
      </div>

      <div *ngIf="!loading && stausGoals.length === 0" class="empty-state">
        <mat-icon>flag</mat-icon>
        <p>No staus goals</p>
      </div>

      <!-- ===== HISTORY (Completed + Cancelled) ===== -->
      <div *ngIf="historyGoals.length > 0" style="margin-top:32px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;cursor:pointer"
          (click)="showHistory = !showHistory">
          <h2 style="font-size:16px;font-weight:700;color:#888;display:flex;align-items:center;gap:8px;margin:0">
            <mat-icon style="color:#aaa">history</mat-icon>
            Goal History <span style="font-size:13px;font-weight:400">({{ historyGoals.length }})</span>
          </h2>
          <mat-icon style="color:#aaa;margin-left:auto">{{ showHistory ? 'expand_less' : 'expand_more' }}</mat-icon>
        </div>

        <div *ngIf="showHistory">
          <div *ngFor="let g of historyGoals" style="margin-bottom:10px;opacity:0.8">
            <div class="card" style="padding:16px;border-left:4px solid {{ g.status === 'COMPLETED' ? '#2e7d32' : '#bdbdbd' }}">
              <ng-container *ngTemplateOutlet="goalCard; context:{g:g,history:true}"></ng-container>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== GOAL CARD TEMPLATE ===== -->
      <ng-template #goalCard let-g="g" let-history="history">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div style="flex:1;min-width:200px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <div style="width:36px;height:36px;border-radius:50%;
                background:linear-gradient(135deg,#1b5e20,#2e7d32);
                color:#fff;font-size:13px;font-weight:700;
                display:flex;align-items:center;justify-content:center;flex-shrink:0">
                {{ getInitials(g) }}
              </div>
              <div>
                <div style="font-weight:700;color:#1a1a2e;font-size:14px">{{ getEmpName(g) }}</div>
                <div style="font-size:11px;color:#aaa">Created: {{ g.createdAt | date:'dd MMM yyyy' }}</div>
              </div>
            </div>

            <p style="font-size:14px;color:#333;margin:0 0 10px;line-height:1.5">{{ g.description || g.title }}</p>

            <div *ngIf="g.progressPercent !== undefined && g.progressPercent !== null">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="font-size:11px;color:#888">Progress</span>
                <span style="font-size:11px;font-weight:600;color:#1b5e20">{{ g.progressPercent }}%</span>
              </div>
              <div style="height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden">
                <div [style.width]="g.progressPercent + '%'"
                  [style.background]="g.progressPercent >= 100 ? '#2e7d32' : '#1b5e20'"
                  style="height:100%;border-radius:3px;transition:width 0.3s"></div>
              </div>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
            <span class="status-chip" [class]="getStatusClass(g.status)">{{ getStatusLabel(g.status) }}</span>
            <span [style.background]="getPriorityBg(g.priority)" [style.color]="getPriorityColor(g.priority)"
              style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600">
              {{ g.priority }} Priority
            </span>
            <div style="font-size:12px;color:#888;display:flex;align-items:center;gap:4px">
              <mat-icon style="font-size:14px;width:14px;height:14px">event</mat-icon>
              Due: {{ g.deadline | date:'dd MMM yyyy' }}
            </div>
          </div>
        </div>

        <!-- Existing Comment -->
        <div *ngIf="g.managerComments && commentId !== (g.goalId || g.employeeId)"
          style="margin-top:12px;padding:10px;background:#f3e5f5;border-radius:8px;border-left:3px solid #7b1fa2">
          <span style="font-size:11px;color:#7b1fa2;font-weight:600">Manager Comment: </span>
          <span style="font-size:13px;color:#555">{{ g.managerComments }}</span>
        </div>

        <!-- Comment Input -->
        <div *ngIf="commentId === (g.goalId || g.employeeId)" style="border-top:1px solid #f0f0f0;padding-top:12px;margin-top:12px">
          <div style="display:flex;gap:10px;align-items:flex-end">
            <mat-form-field appearance="outline" style="flex:1;margin-bottom:-1.25em">
              <mat-label>Add Comment</mat-label>
              <input matInput [(ngModel)]="commentText" placeholder="Write a comment for this goal..." />
            </mat-form-field>
            <button mat-flat-button (click)="saveComment(g.goalId || g.employeeId || 0)" [disabled]="saving"
              style="background:#1b5e20;color:#fff">{{ saving ? 'Saving...' : 'Save' }}</button>
            <button mat-button (click)="commentId = null">Cancel</button>
          </div>
        </div>

        <div *ngIf="!history" style="margin-top:12px">
          <button mat-stroked-button (click)="openComment(g)" style="color:#1b5e20;border-color:#1b5e20;font-size:13px">
            <mat-icon>comment</mat-icon> {{ g.managerComments ? 'Update Comment' : 'Add Comment' }}
          </button>
        </div>
      </ng-template>

    </div>
  `
})
export class ManagerGoalsComponent implements OnInit {
  allGoals: Goal[] = [];
  teamMembers: User[] = [];
  loading = true;
  saving = false;
  creating = false;
  showCreateForm = false;
  showHistory = false;
  commentId: number | null = null;
  commentText = '';
  today = new Date().toISOString().split('T')[0];

  newGoal: any = {
    employeeId: null as number | null,
    description: '',
    deadline: '',
    priority: 'MEDIUM'
  };

  constructor(private managerService: ManagerService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    this.loadGoals();
    this.loadTeam();
  }

  loadGoals(): void {
    this.loading = true;
    this.managerService.getGoals().subscribe({
      next: (d: any) => {
        this.allGoals = Array.isArray(d) ? d : [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadTeam(): void {
    this.managerService.getTeamMembers().subscribe({
      next: (d: any) => { this.teamMembers = Array.isArray(d) ? d : []; },
      error: () => {}
    });
  }

  // staus = NOT_STARTED or IN_PROGRESS
  get stausGoals(): Goal[] {
    return this.allGoals.filter(g => g.status === 'NOT_STARTED' || g.status === 'IN_PROGRESS');
  }

  // History = COMPLETED or CANCELLED — sorted newest first
  get historyGoals(): Goal[] {
    return this.allGoals
      .filter(g => g.status === 'COMPLETED' || g.status === 'CANCELLED')
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
  }

  createGoal(): void {
    if (!this.newGoal.employeeId || !this.newGoal.description.trim() || !this.newGoal.deadline) return;
    this.creating = true;
    this.managerService.createGoal(this.newGoal).subscribe({
      next: () => {
        this.creating = false;
        this.resetForm();
        this.snackBar.open('Goal assigned successfully!', 'Close', { duration: 2500 });
        this.loadGoals();
      },
      error: () => {
        this.creating = false;
        this.snackBar.open('Error assigning goal', 'Close', { duration: 2000 });
      }
    });
  }

  resetForm(): void {
    this.showCreateForm = false;
    this.newGoal = { employeeId: null, description: '', deadline: '', priority: 'MEDIUM' };
  }

  getSelectedEmployeeName(): string {
    const emp = this.teamMembers.find(m => ( m.employeeId || m.employeeId) === this.newGoal.employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : '';
  }

  count(s: string): number { return this.allGoals.filter(g => g.status === s).length; }

  openComment(g: Goal): void {
    this.commentId = g.goalId || g.employeeId || null;
    this.commentText = g.managerComments || '';
  }

  saveComment(id: number): void {
    if (!this.commentText.trim()) return;
    this.saving = true;
    this.managerService.addGoalComment(id, this.commentText).subscribe({
      next: () => {
        this.saving = false; this.commentId = null;
        this.snackBar.open('Comment saved!', 'Close', { duration: 2000 });
        this.loadGoals();
      },
      error: () => { this.saving = false; this.snackBar.open('Error', 'Close', { duration: 2000 }); }
    });
  }

  getInitials(g: Goal): string {
    return '?';
  }
  getEmpName(g: Goal): string {
    return 'Emp #' + g.employeeId;
  }
  getStatusClass(s: string): string {
    const m: Record<string,string> = { 'COMPLETED':'APPROVED','IN_PROGRESS':'PENDING','NOT_STARTED':'REJECTED','CANCELLED':'CANCELLED' };
    return m[s] || 'PENDING';
  }
  getStatusLabel(s: string): string {
    const m: Record<string,string> = { 'NOT_STARTED':'⏸ Not Started','IN_PROGRESS':'🔄 In Progress','COMPLETED':'✅ Completed','CANCELLED':'❌ Cancelled' };
    return m[s] || s;
  }
  getPriorityBg(p: string): string { return p==='HIGH'?'#fce4ec':p==='MEDIUM'?'#fff8e1':'#e8f5e9'; }
  getPriorityColor(p: string): string { return p==='HIGH'?'#c62828':p==='MEDIUM'?'#f57f17':'#2e7d32'; }
}
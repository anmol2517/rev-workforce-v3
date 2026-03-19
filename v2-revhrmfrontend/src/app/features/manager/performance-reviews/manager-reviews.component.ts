import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ManagerService } from '../../../core/services/manager.service';
import { PerformanceReview, Goal } from '../../../core/models/models';

@Component({
  selector: 'app-manager-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Performance Reviews</h1>
        <div style="display:flex;gap:10px">
          <span style="background:#fff8e1;color:#f57f17;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
            {{ pendingReviews.length }} Pending
          </span>
          <span style="background:#e8f5e9;color:#2e7d32;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
            {{ completedReviews.length }} Completed
          </span>
        </div>
      </div>

      <!-- Completed Goals Banner -->
      <div *ngIf="completedGoals.length > 0" class="card"
        style="padding:20px;margin-bottom:24px;border-left:4px solid #2e7d32">
        <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:16px;display:flex;align-items:center;gap:8px">
          <mat-icon style="color:#2e7d32">emoji_events</mat-icon>
          Team Completed Goals — For Review Context ({{ completedGoals.length }})
        </h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
          <div *ngFor="let g of completedGoals"
            style="padding:14px;background:#f1f8e9;border-radius:10px;border:1px solid #c5e1a5">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <div style="width:28px;height:28px;border-radius:50%;background:#2e7d32;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">
                {{ getGoalInitials(g) }}
              </div>
              <div>
                <div style="font-weight:700;color:#1a1a2e;font-size:12px">{{ getGoalEmpName(g) }}</div>
                <div style="font-size:10px;color:#66bb6a">✅ Completed {{ g.updatedAt || g.deadline | date:'dd MMM yyyy' }}</div>
              </div>
            </div>
            <p style="font-size:12px;color:#555;margin:0;line-height:1.5">{{ g.description || g.title }}</p>
            <div style="margin-top:6px;display:flex;justify-content:space-between">
              <span style="font-size:10px;color:#888">Due: {{ g.deadline | date:'dd MMM yyyy' }}</span>
              <span [style.background]="getPriorityBg(g.priority)" [style.color]="getPriorityColor(g.priority)"
                style="padding:1px 8px;border-radius:10px;font-size:10px;font-weight:600">{{ g.priority }}</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

      <!-- ===== PENDING REVIEWS ===== -->
      <div *ngIf="pendingReviews.length > 0">
        <h2 style="font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <mat-icon style="color:#f57f17">pending_actions</mat-icon>
          Awaiting Your Feedback
          <span style="font-size:13px;color:#888;font-weight:400">({{ pendingReviews.length }})</span>
        </h2>
        <div *ngFor="let r of pendingReviews" class="card" style="margin-bottom:14px;padding:20px">
          <ng-container *ngTemplateOutlet="reviewCard; context:{r:r}"></ng-container>
        </div>
      </div>

      <div *ngIf="!loading && pendingReviews.length === 0" class="empty-state">
        <mat-icon>star_border</mat-icon>
        <p>No pending reviews</p>
        <p style="font-size:13px;color:#aaa">All caught up! Check history below for past reviews.</p>
      </div>

      <!-- ===== HISTORY (Completed) ===== -->
      <div *ngIf="completedReviews.length > 0" style="margin-top:32px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;cursor:pointer"
          (click)="showHistory = !showHistory">
          <h2 style="font-size:16px;font-weight:700;color:#888;display:flex;align-items:center;gap:8px;margin:0">
            <mat-icon style="color:#aaa">history</mat-icon>
            Review History
            <span style="font-size:13px;font-weight:400">({{ completedReviews.length }})</span>
          </h2>
          <mat-icon style="color:#aaa;margin-left:auto">{{ showHistory ? 'expand_less' : 'expand_more' }}</mat-icon>
        </div>

        <div *ngIf="showHistory">
          <div *ngFor="let r of completedReviews" style="margin-bottom:10px;opacity:0.85">
            <div class="card" style="padding:16px;border-left:4px solid #4caf50">
              <ng-container *ngTemplateOutlet="reviewCard; context:{r:r,history:true}"></ng-container>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== REVIEW CARD TEMPLATE ===== -->
      <ng-template #reviewCard let-r="r" let-history="history">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#6a1b9a,#7b1fa2);color:#fff;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center">
              {{ getInitials(r) }}
            </div>
            <div>
              <div style="font-weight:700;color:#1a1a2e">{{ getEmpName(r) }}</div>
              <div style="font-size:12px;color:#aaa">Submitted: {{ r.submittedAt | date:'dd MMM yyyy' }}</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <span *ngIf="r.selfRating"
              style="background:#fff8e1;color:#f57f17;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600">
              ⭐ Self: {{ r.selfRating }}/5
            </span>
            <span class="status-chip" [class]="getStatusClass(r.status)">{{ r.status }}</span>
          </div>
        </div>

        <!-- Completed Goals linked to this employee -->
        <div *ngIf="getEmpCompletedGoals(r).length > 0"
          style="margin-bottom:14px;padding:10px;background:#e8f5e9;border-radius:8px;border-left:3px solid #2e7d32">
          <div style="font-size:11px;color:#2e7d32;font-weight:700;margin-bottom:6px">
            COMPLETED GOALS ({{ getEmpCompletedGoals(r).length }})
          </div>
          <div *ngFor="let cg of getEmpCompletedGoals(r)"
            style="font-size:12px;color:#333;padding:4px 0;border-bottom:1px solid #c8e6c9;display:flex;justify-content:space-between">
            <span>✅ {{ cg.description || cg.title }}</span>
            <span style="color:#888;font-size:11px;white-space:nowrap;margin-left:8px">{{ cg.deadline | date:'dd MMM' }}</span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <div *ngIf="r.keyDeliverables" style="padding:10px;background:#f8f9fa;border-radius:8px">
            <div style="font-size:10px;color:#888;font-weight:600;margin-bottom:4px">KEY DELIVERABLES</div>
            <div style="font-size:13px;color:#333;line-height:1.5">{{ r.keyDeliverables }}</div>
          </div>
          <div *ngIf="r.accomplishments" style="padding:10px;background:#e8f5e9;border-radius:8px">
            <div style="font-size:10px;color:#388e3c;font-weight:600;margin-bottom:4px">ACCOMPLISHMENTS</div>
            <div style="font-size:13px;color:#333;line-height:1.5">{{ r.accomplishments }}</div>
          </div>
          <div *ngIf="r.areasOfImprovement" style="padding:10px;background:#fce4ec;border-radius:8px;grid-column:span 2">
            <div style="font-size:10px;color:#c62828;font-weight:600;margin-bottom:4px">AREAS OF IMPROVEMENT</div>
            <div style="font-size:13px;color:#333;line-height:1.5">{{ r.areasOfImprovement }}</div>
          </div>
        </div>

        <!-- Existing Feedback -->
        <div *ngIf="r.managerFeedback"
          style="padding:12px;background:#f3e5f5;border-radius:8px;border-left:3px solid #7b1fa2;margin-bottom:12px">
          <div style="font-size:11px;color:#7b1fa2;font-weight:600;margin-bottom:4px">YOUR FEEDBACK</div>
          <div style="font-size:13px;color:#333">{{ r.managerFeedback }}</div>
          <div style="margin-top:6px;display:flex;gap:8px;align-items:center">
            <span style="font-size:11px;color:#888">Rating:</span>
            <span style="font-weight:700;color:#7b1fa2">{{ r.managerRating }}/5 ⭐</span>
          </div>
        </div>

        <!-- Feedback Form -->
        <div *ngIf="feedbackId === (r.reviewId || r.employeeId)" style="border-top:1px solid #f0f0f0;padding-top:14px">
          <form [formGroup]="feedbackForm" (ngSubmit)="submitFeedback(r.reviewId || r.employeeId || 0)">
            <div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end">
              <mat-form-field appearance="outline" style="margin-bottom:-1.25em">
                <mat-label>Feedback</mat-label>
                <textarea matInput formControlName="feedback" rows="3" placeholder="Write your feedback..."></textarea>
              </mat-form-field>
              <mat-form-field appearance="outline" style="width:120px;margin-bottom:-1.25em">
                <mat-label>Rating</mat-label>
                <mat-select formControlName="managerRating">
                  <mat-option [value]="1">1 ⭐</mat-option>
                  <mat-option [value]="2">2 ⭐</mat-option>
                  <mat-option [value]="3">3 ⭐</mat-option>
                  <mat-option [value]="4">4 ⭐</mat-option>
                  <mat-option [value]="5">5 ⭐</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
              <button mat-button type="button" (click)="feedbackId = null">Cancel</button>
              <button mat-flat-button type="submit" [disabled]="feedbackForm.invalid || saving"
                style="background:#7b1fa2;color:#fff">
                {{ saving ? 'Saving...' : 'Submit Feedback' }}
              </button>
            </div>
          </form>
        </div>

        <div *ngIf="feedbackId !== (r.reviewId || r.employeeId) && !history" style="margin-top:10px">
          <button mat-stroked-button (click)="openFeedback(r)" style="color:#7b1fa2;border-color:#7b1fa2">
            <mat-icon>rate_review</mat-icon>
            {{ r.managerFeedback ? 'Update Feedback' : 'Give Feedback' }}
          </button>
        </div>
      </ng-template>

    </div>
  `
})
export class ManagerReviewsComponent implements OnInit {
  allReviews: PerformanceReview[] = [];
  allGoals: Goal[] = [];
  completedGoals: Goal[] = [];
  loading = true;
  saving = false;
  showHistory = false;
  feedbackId: number | null = null;
  feedbackForm!: FormGroup;

  constructor(private managerService: ManagerService, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    setTimeout(() => { this.loading = false; }, 8000);
    this.managerService.getPerformanceReviews().subscribe({
      next: (d: any) => {
        this.allReviews = Array.isArray(d) ? d : [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
    this.managerService.getGoals().subscribe({
      next: (d: any) => {
        this.allGoals = Array.isArray(d) ? d : [];        this.completedGoals = this.allGoals.filter(g => g.status === 'COMPLETED');
      },
      error: () => {}
    });
  }

  // Pending = DRAFT, SUBMITTED, UNDER_REVIEW
  get pendingReviews(): PerformanceReview[] {
  return this.allReviews.filter(r => 
    r.status === 'DRAFT' || r.status === 'SUBMITTED'
  );
}

  // History = COMPLETED only
  get completedReviews(): PerformanceReview[] {
    return this.allReviews
      .filter(r => r.status === 'COMPLETED')
      .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
  }

  getEmpCompletedGoals(r: PerformanceReview): Goal[] {
    if (!r.employeeId) return [];
    return this.completedGoals.filter(g => g.employeeId === r.employeeId);
  }

  openFeedback(r: PerformanceReview): void {
    this.feedbackId = r.reviewId || r.employeeId || null;
    this.feedbackForm = this.fb.group({
      feedback: [r.managerFeedback || '', Validators.required],
      managerRating: [r.managerRating || 3, Validators.required]
    });
  }

  submitFeedback(id: number): void {
    if (this.feedbackForm.invalid) return;
    this.saving = true;
    this.managerService.submitFeedback(id, this.feedbackForm.value).subscribe({
      next: () => {
        this.saving = false; this.feedbackId = null;
        this.snackBar.open('Feedback submitted!', 'Close', { duration: 2000 });
        this.ngOnInit();
      },
      error: () => { this.saving = false; this.snackBar.open('Error', 'Close', { duration: 2000 }); }
    });
  }

  getInitials(r: PerformanceReview): string {
    return r.employeeName ? r.employeeName.split(' ').map((n: string) => n.charAt(0)).join('').slice(0,2).toUpperCase() : '?';
  }
  getEmpName(r: PerformanceReview): string {
    return r.employeeName || 'Unknown';
  }
  getGoalInitials(g: Goal): string {
    return '?';
  }
  getGoalEmpName(g: Goal): string {
    return 'Emp #' + g.employeeId;
  }
  getStatusClass(s: string): string {
    const m: Record<string, string> = { 'COMPLETED': 'APPROVED', 'SUBMITTED': 'PENDING', 'UNDER_REVIEW': 'PENDING', 'DRAFT': 'PENDING' };
    return m[s] || 'PENDING';
  }
  getPriorityBg(p: string): string { return p==='HIGH'?'#fce4ec':p==='MEDIUM'?'#fff8e1':'#e8f5e9'; }
  getPriorityColor(p: string): string { return p==='HIGH'?'#c62828':p==='MEDIUM'?'#f57f17':'#2e7d32'; }
}
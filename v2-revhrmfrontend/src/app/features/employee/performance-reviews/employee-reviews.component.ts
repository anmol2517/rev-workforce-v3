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
import { EmployeeService } from '../../../core/services/employee.service';
import { PerformanceReview } from '../../../core/models/models';

@Component({
  selector: 'app-employee-reviews',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatTabsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Performance Reviews</h1>
        <span style="background:#f3e5f5;color:#6a1b9a;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600">
          {{ statusReviews.length }} staus
        </span>
      </div>

      <mat-tab-group>

        <!-- TAB 1: My Reviews -->
        <mat-tab label="My Reviews">
          <div style="margin-top:16px">
            <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>

            <div *ngIf="!loading && allReviews.length === 0" class="empty-state">
              <mat-icon>star_rate</mat-icon>
              <p>No performance reviews yet</p>
              <p style="font-size:13px;color:#aaa">Submit your first review from the Submit Review tab</p>
            </div>

            <!-- staus Reviews -->
            <div *ngFor="let r of statusReviews" class="card"
              style="margin-bottom:16px;padding:20px;border-left:4px solid #7b1fa2">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
                <div>
                  <div style="font-weight:700;color:#1a1a2e;font-size:15px">
                    Review — {{ r.reviewYear | date:'dd MMM yyyy' }}
                  </div>
                  <div style="font-size:12px;color:#aaa;margin-top:2px">ID #{{ r.reviewId }}</div>
                </div>
                <div style="display:flex;gap:8px;align-items:center">
                  <span *ngIf="r.selfRating"
                    style="background:#fff8e1;color:#f57f17;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600">
                    ⭐ Self: {{ r.selfRating }}/5
                  </span>
                  <span class="status-chip" [class]="getStatusClass(r.status)">{{ r.status }}</span>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
                <div *ngIf="r.keyDeliverables" style="padding:12px;background:#f8f9fa;border-radius:8px">
                  <div style="font-size:11px;color:#888;font-weight:600;margin-bottom:6px">KEY DELIVERABLES</div>
                  <div style="font-size:13px;color:#333;line-height:1.5">{{ r.keyDeliverables }}</div>
                </div>
                <div *ngIf="r.accomplishments" style="padding:12px;background:#e8f5e9;border-radius:8px">
                  <div style="font-size:11px;color:#388e3c;font-weight:600;margin-bottom:6px">ACCOMPLISHMENTS</div>
                  <div style="font-size:13px;color:#333;line-height:1.5">{{ r.accomplishments }}</div>
                </div>
                <div *ngIf="r.areasOfImprovement"
                  style="padding:12px;background:#fce4ec;border-radius:8px;grid-column:span 2">
                  <div style="font-size:11px;color:#c62828;font-weight:600;margin-bottom:6px">AREAS OF IMPROVEMENT</div>
                  <div style="font-size:13px;color:#333;line-height:1.5">{{ r.areasOfImprovement }}</div>
                </div>
              </div>

              <div *ngIf="r.managerFeedback"
                style="padding:14px;background:#f0f7ff;border-radius:8px;border-left:3px solid #1565c0">
                <div style="font-size:11px;color:#1565c0;font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:4px">
                  <mat-icon style="font-size:14px;width:14px;height:14px">rate_review</mat-icon>
                  MANAGER FEEDBACK
                </div>
                <div style="font-size:14px;color:#333;margin-bottom:6px">{{ r.managerFeedback }}</div>
                <div style="font-size:12px;color:#888">
                  Manager Rating: <strong style="color:#1565c0">{{ r.managerRating }}/5 ⭐</strong>
                </div>
              </div>

              <div *ngIf="!r.managerFeedback"
                style="padding:10px;background:#fff8e1;border-radius:8px;border-left:3px solid #f9a825;margin-top:8px">
                <div style="font-size:12px;color:#f57f17;font-weight:600">⏳ Self Feedback</div>
              </div>
            </div>

            <!-- History Section -->
            <div *ngIf="historyReviews.length > 0" style="margin-top:28px">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;cursor:pointer"
                (click)="showHistory = !showHistory">
                <div style="flex:1;height:1px;background:#e0e0e0"></div>
                <div style="display:flex;align-items:center;gap:8px;padding:8px 16px;background:#f5f5f5;border-radius:20px;white-space:nowrap">
                  <mat-icon style="font-size:18px;width:18px;height:18px;color:#888">history</mat-icon>
                  <span style="font-size:13px;font-weight:600;color:#666">
                    Past Reviews ({{ historyReviews.length }})
                  </span>
                  <mat-icon style="font-size:16px;width:16px;height:16px;color:#888">
                    {{ showHistory ? 'expand_less' : 'expand_more' }}
                  </mat-icon>
                </div>
                <div style="flex:1;height:1px;background:#e0e0e0"></div>
              </div>

              <div *ngIf="showHistory">
                <div *ngFor="let r of historyReviews" class="card"
                  style="margin-bottom:12px;padding:16px;opacity:0.82;border-left:4px solid"
                  [style.border-left-color]="r.status === 'COMPLETED' ? '#7b1fa2' : '#bbb'">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
                    <div>
                      <div style="font-weight:600;color:#555;font-size:14px">
                        {{ r.reviewYear | date:'dd MMM yyyy' }}
                      </div>
                      <div style="font-size:11px;color:#aaa">#{{ r.reviewId }}</div>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center">
                      <span *ngIf="r.selfRating"
                        style="background:#fff8e1;color:#f57f17;padding:3px 8px;border-radius:10px;font-size:11px;font-weight:600">
                        ⭐ {{ r.selfRating }}/5
                      </span>
                      <span class="status-chip" [class]="getStatusClass(r.status)">{{ r.status }}</span>
                    </div>
                  </div>

                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
                    <div *ngIf="r.keyDeliverables" style="padding:10px;background:#f8f9fa;border-radius:7px">
                      <div style="font-size:10px;color:#aaa;font-weight:600;margin-bottom:3px">DELIVERABLES</div>
                      <div style="font-size:12px;color:#555">{{ r.keyDeliverables }}</div>
                    </div>
                    <div *ngIf="r.accomplishments" style="padding:10px;background:#f1f8e9;border-radius:7px">
                      <div style="font-size:10px;color:#66bb6a;font-weight:600;margin-bottom:3px">ACCOMPLISHMENTS</div>
                      <div style="font-size:12px;color:#555">{{ r.accomplishments }}</div>
                    </div>
                  </div>

                  <div *ngIf="r.managerFeedback"
                    style="padding:10px;background:#f0f7ff;border-radius:7px;border-left:3px solid #90caf9">
                    <div style="font-size:10px;color:#1565c0;font-weight:600;margin-bottom:3px">MANAGER FEEDBACK</div>
                    <div style="font-size:12px;color:#555">{{ r.managerFeedback }}</div>
                    <div style="font-size:11px;color:#888;margin-top:2px">
                      Rating: {{ r.managerRating }}/5
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- TAB 2: Submit Review -->
        <mat-tab label="Submit Review">
          <div class="card" style="margin-top:16px;max-width:640px">
            <h3 style="font-weight:700;color:#1a1a2e;margin-bottom:6px">Submit Performance Review</h3>
            <p style="font-size:13px;color:#888;margin-bottom:20px">
              "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।" — Bhagavad Gita 2.47
            </p>

            <form [formGroup]="reviewForm" (ngSubmit)="submitReview()">
              <mat-form-field appearance="outline" style="width:100%;margin-bottom:4px">
                <mat-label>Key Deliverables *</mat-label>
                <textarea matInput formControlName="keyDeliverables" rows="3"
                  placeholder="What were your key responsibilities and deliverables this period?"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" style="width:100%;margin-bottom:4px">
                <mat-label>Accomplishments *</mat-label>
                <textarea matInput formControlName="accomplishments" rows="3"
                  placeholder="What did you achieve? Mention specific results..."></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" style="width:100%;margin-bottom:4px">
                <mat-label>Areas of Improvement</mat-label>
                <textarea matInput formControlName="areasOfImprovement" rows="2"
                  placeholder="What areas would you like to develop further?"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" style="width:100%;margin-bottom:16px">
                <mat-label>Self Rating (1–5)</mat-label>
                <mat-select formControlName="employeeSelfRating">
                  <mat-option [value]="1">1 — Needs Improvement</mat-option>
                  <mat-option [value]="2">2 — Below Average</mat-option>
                  <mat-option [value]="3">3 — Average</mat-option>
                  <mat-option [value]="4">4 — Good</mat-option>
                  <mat-option [value]="5">5 — Excellent</mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-flat-button type="submit" [disabled]="reviewForm.invalid || submitting"
                style="background:#4a148c;color:#fff;width:100%;padding:12px 0;font-size:15px">
                {{ submitting ? 'Submitting...' : 'Submit Review' }}
              </button>
            </form>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `
})
export class EmployeeReviewsComponent implements OnInit {
  allReviews: PerformanceReview[] = [];
  statusReviews: PerformanceReview[] = [];
  historyReviews: PerformanceReview[] = [];
  loading = true;
  submitting = false;
  showHistory = false;
  reviewForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Safety: force loading=false after 8s to prevent infinite spinner
    setTimeout(() => { this.loading = false; }, 8000);
    this.loadReviews();
    this.reviewForm = this.fb.group({
      keyDeliverables: ['', Validators.required],
      accomplishments: ['', Validators.required],
      areasOfImprovement: [''],
      employeeSelfRating: [4, Validators.required]
    });
  }

  loadReviews(): void {
    this.loading = true;
    this.employeeService.getMyReviews().subscribe({
      next: (d: any) => {
        this.allReviews = Array.isArray(d) ? d : [];        
        this.statusReviews = this.allReviews.filter(r =>
          r.status === 'SUBMITTED' || r.status === 'FEEDBACK_PROVIDED' || r.status === 'DRAFT'
        );
        this.historyReviews = this.allReviews.filter(r => r.status === 'COMPLETED');
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) return;
    this.submitting = true;
    this.employeeService.createOrUpdateReview(this.reviewForm.value).subscribe({
      next: () => {
        this.reviewForm.reset({ employeeSelfRating: 4 });
        this.submitting = false;
        this.loadReviews();
        this.snackBar.open('Review submitted successfully!', 'Close', { duration: 2500 });
      },
      error: () => {
        this.submitting = false;
        this.snackBar.open('Error submitting review', 'Close', { duration: 2000 });
      }
    });
  }

  getStatusClass(s: string): string {
    const m: Record<string,string> = {
      'COMPLETED': 'APPROVED', 'SUBMITTED': 'PENDING',
      'FEEDBACK_PROVIDED': 'PENDING', 'DRAFT': 'REJECTED'
    };
    return m[s] || 'PENDING';
  }
}
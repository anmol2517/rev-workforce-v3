import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-announcements',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Announcements</h1>
        <button mat-flat-button color="primary" (click)="openForm()" *ngIf="!showForm">
          <mat-icon>add</mat-icon> New Announcement
        </button>
      </div>
      <div class="card" *ngIf="showForm" style="margin-bottom:20px">
        <h3 style="margin-bottom:20px;font-weight:600;color:#1a1a2e">
          {{ editId ? 'Edit Announcement' : 'Create Announcement' }}
        </h3>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Content</mat-label>
            <textarea matInput formControlName="content" rows="4"></textarea>
          </mat-form-field>
          <div style="display:flex;gap:12px;justify-content:flex-end">
            <button mat-button type="button" (click)="closeForm()">Cancel</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving">
              {{ saving ? 'Saving...' : editId ? 'Update' : 'Publish' }}
            </button>
          </div>
        </form>
      </div>
      <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>
      <ng-container *ngIf="!loading">
        <div *ngIf="announcements.length === 0 && !showForm" class="empty-state">
          <mat-icon>campaign</mat-icon>
          <p>No announcements yet.</p>
          <button mat-flat-button color="primary" (click)="openForm()">
            <mat-icon>add</mat-icon> Create Announcement
          </button>
        </div>
        <div *ngFor="let a of announcements" class="card" style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                <div style="width:40px;height:40px;border-radius:10px;
                  background:linear-gradient(135deg,#4a148c,#7b1fa2);
                  display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <mat-icon style="color:#fff;font-size:20px;width:20px;height:20px">campaign</mat-icon>
                </div>
                <div style="flex:1">
                  <h3 style="font-size:16px;font-weight:700;color:#1a1a2e;margin:0">{{ a.title }}</h3>
                  <p style="font-size:12px;color:#aaa;margin:2px 0 0">
                    {{ a.createdAt | date:'dd MMM yyyy, hh:mm a' }}
                  </p>
                </div>
              </div>
              <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 12px 50px">{{ a.content }}</p>
              <div style="margin-left:50px">
                <span class="status-chip" [class]="a.active ? 'APPROVED' : 'REJECTED'">
                  {{ a.active ? '✓ Active' : '✗ Inactive' }}
                </span>
              </div>
            </div>
            <div style="display:flex;gap:4px;margin-left:12px">
              <button mat-icon-button color="primary" (click)="openForm(a)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="delete(a.announcementId)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: ['.full-width { width: 100%; }']
})
export class AdminAnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  showForm = false;
  saving = false;
  loading = true;
  editId: number | null = null;
  form!: FormGroup;

  constructor(private adminService: AdminService, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    setTimeout(() => { this.loading = false; }, 8000);
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
  this.loading = true;
  this.adminService.getAnnouncements().subscribe({
    next: (d: any) => {
      const arr = Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []);
      // Sirf active announcements dikhao
      this.announcements = arr.filter((a: any) => a.active !== false);
      this.loading = false;
    },
    error: () => this.loading = false
  });
}

  openForm(a?: any): void {
    this.editId = a?.announcementId || null;
    this.form = this.fb.group({
      title: [a?.title || '', Validators.required],
      content: [a?.content || '', Validators.required]
    });
    this.showForm = true;
  }

  closeForm(): void { this.showForm = false; this.editId = null; }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const req = this.editId
      ? this.adminService.updateAnnouncement(this.editId, this.form.value)
      : this.adminService.createAnnouncement(this.form.value);
    req.subscribe({
      next: () => {
        this.saving = false; this.closeForm(); this.loadAnnouncements();
        this.snackBar.open(this.editId ? 'Updated!' : 'Published!', 'Close', { duration: 2000 });
      },
      error: () => { this.saving = false; this.snackBar.open('Error!', 'Close', { duration: 2000 }); }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this announcement?')) return;
    this.adminService.deleteAnnouncement(id).subscribe({
      next: () => { this.loadAnnouncements(); this.snackBar.open('Deleted!', 'Close', { duration: 2000 }); },
      error: () => this.snackBar.open('Error!', 'Close', { duration: 2000 })
    });
  }
}
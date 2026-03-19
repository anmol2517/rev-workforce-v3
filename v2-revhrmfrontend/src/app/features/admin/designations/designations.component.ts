import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule, MatSelectModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Designations</h1>
        <button mat-flat-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Designation
        </button>
      </div>
      <div class="card">
        <div *ngIf="loading" class="loading-overlay"><mat-spinner></mat-spinner></div>
        <table mat-table [dataSource]="items" *ngIf="!loading">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let d">{{ d.designationId }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let d"><strong>{{ d.title }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="level">
            <th mat-header-cell *matHeaderCellDef>Level</th>
            <td mat-cell *matCellDef="let d">
              <span [style.background]="d.level === 'SENIOR' ? '#e8eaf6' : '#e8f5e9'"
                [style.color]="d.level === 'SENIOR' ? '#1a237e' : '#2e7d32'"
                style="padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600">
                {{ d.level || 'JUNIOR' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let d">{{ d.description || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let d">
              <span class="status-chip" [class]="d.active ? 'APPROVED' : 'REJECTED'">
                {{ d.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let d">
              <button mat-icon-button color="primary" (click)="openForm(d)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="delete(d.designationId)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <div *ngIf="!loading && items.length === 0" class="empty-state">
          <mat-icon>badge</mat-icon><p>No designations found</p>
        </div>
      </div>
      <div *ngIf="showForm" class="dialog-overlay" (click)="closeForm()">
        <mat-card class="dialog-card" (click)="$event.stopPropagation()">
          <mat-card-header style="padding:16px 16px 0">
            <mat-card-title>{{ editId ? 'Edit' : 'Add' }} Designation</mat-card-title>
          </mat-card-header>
          <mat-card-content style="padding:16px !important">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Designation Title</mat-label>
                <input matInput formControlName="title">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Level</mat-label>
                <mat-select formControlName="level">
                  <mat-option value="JUNIOR">Junior</mat-option>
                  <mat-option value="SENIOR">Senior</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3"></textarea>
              </mat-form-field>
              <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px">
                <button mat-button type="button" (click)="closeForm()">Cancel</button>
                <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
                  {{ editId ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: ['.full-width { width: 100%; }']
})
export class DesignationsComponent implements OnInit {
  items: any[] = [];
  cols = ['id', 'name', 'level', 'description', 'status', 'actions'];
  loading = true; showForm = false; editId: number | null = null;
  form!: FormGroup;

  constructor(private adminService: AdminService, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void { this.load(); }

  load(): void {
  this.loading = true;
  this.adminService.getDesignations().subscribe({
    next: (d: any) => {
      const arr = Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []);
      // Sirf active dikhao, serial wise sort karo
      this.items = arr
        .filter((x: any) => x.active !== false)
        .sort((a: any, b: any) => (a.designationId || 0) - (b.designationId || 0));
      this.loading = false;
    },
    error: () => this.loading = false
  });
}

  openForm(d?: any): void {
    this.editId = d?.designationId || null;
    this.form = this.fb.group({
      title: [d?.title || d?.name || '', Validators.required],
      level: [d?.level || 'JUNIOR', Validators.required],
      description: [d?.description || '']
    });
    this.showForm = true;
  }

  closeForm(): void { this.showForm = false; }

  onSubmit(): void {
    if (this.form.invalid) return;
    const req = this.editId
      ? this.adminService.updateDesignation(this.editId, this.form.value)
      : this.adminService.createDesignation(this.form.value);
    req.subscribe({
      next: () => { this.closeForm(); this.load(); this.snackBar.open('Saved!', 'Close', { duration: 2000 }); },
      error: () => this.snackBar.open('Error!', 'Close', { duration: 2000 })
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this designation?')) return;
    this.adminService.deleteDesignation(id).subscribe({
      next: () => { this.load(); this.snackBar.open('Deleted!', 'Close', { duration: 2000 }); },
      error: () => this.snackBar.open('Error deleting!', 'Close', { duration: 2000 })
    });
  }
}
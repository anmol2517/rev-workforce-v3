import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.api}/api/employees/me`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.api}/api/employees/me`, data);
  }

  getDashboard(): Observable<any> {
    return this.getLeaveBalance();
  }

  getLeaveBalance(): Observable<any> {
    return this.http.get(`${this.api}/api/leaves/balance`);
  }

  getMyLeaves(): Observable<any> {
    return this.http.get(`${this.api}/api/leaves/my`);
  }

  getLeaveApplications(): Observable<any> {
    return this.getMyLeaves();
  }

  applyLeave(data: any): Observable<any> {
    return this.http.post(`${this.api}/api/leaves/apply`, data);
  }

  cancelLeave(id: number): Observable<any> {
    return this.http.put(`${this.api}/api/leaves/${id}/cancel`, {});
  }

  getHolidays(): Observable<any> {
    return this.http.get(`${this.api}/api/admin/holidays/current-year`);
  }

  getMyReviews(): Observable<any> {
    return this.http.get(`${this.api}/api/performance/reviews/my`);
  }

  getPerformanceReviews(): Observable<any> {
    return this.getMyReviews();
  }

  getReviewById(id: number): Observable<any> {
    return this.http.get(`${this.api}/api/performance/reviews/${id}`);
  }

  createOrUpdateReview(data: any): Observable<any> {
    return this.http.post(`${this.api}/api/performance/reviews`, data);
  }

  createPerformanceReview(data: any): Observable<any> {
    return this.createOrUpdateReview(data);
  }

  submitReview(id: number): Observable<any> {
    return this.http.put(`${this.api}/api/performance/reviews/${id}/submit`, {});
  }

  getMyGoals(): Observable<any> {
    return this.http.get(`${this.api}/api/performance/goals/my`);
  }

  getGoals(): Observable<any> {
    return this.getMyGoals();
  }

  getGoalById(id: number): Observable<any> {
    return this.http.get(`${this.api}/api/performance/goals/${id}`);
  }

  createGoal(data: any): Observable<any> {
    return this.http.post(`${this.api}/api/performance/goals`, data);
  }

  updateGoalProgress(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/api/performance/goals/${id}/progress`, data);
  }

  getAnnouncements(): Observable<any> {
    return this.http.get(`${this.api}/api/admin/announcements/active`);
  }

  getDirectory(page = 0, size = 50, search?: string): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get(`${this.api}/api/employees/directory`, { params });
  }

  getNotifications(): Observable<any> {
    return this.http.get(`${this.api}/api/notifications`);
  }

  getUnreadNotifications(): Observable<any> {
    return this.http.get(`${this.api}/api/notifications/unread`);
  }

  getUnreadCount(): Observable<any> {
    return this.http.get(`${this.api}/api/notifications/unread/count`);
  }

  markNotificationRead(id: number): Observable<any> {
    return this.http.put(`${this.api}/api/notifications/${id}/read`, {});
  }

  markAllNotificationsRead(): Observable<any> {
    return this.http.put(`${this.api}/api/notifications/read-all`, {});
  }
}
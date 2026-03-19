import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ROUTES } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ManagerService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // ── PROFILE ──
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${API_ROUTES.EMPLOYEE.ME}`);
  }
  updateProfile(data: any): Observable<any> {
    const payload: any = {};
    if (data.phone   !== undefined) payload.phone   = data.phone;
    if (data.address !== undefined) payload.address = data.address;
    return this.http.put<any>(`${this.apiUrl}${API_ROUTES.EMPLOYEE.ME_UPDATE}`, payload);
  }

  // ── TEAM ──
  getTeamMembers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${API_ROUTES.EMPLOYEE.MANAGER_TEAM}`).pipe(
      map((d: any) => {
        const arr = Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []);
        return arr.filter((e: any) => (e.status || '').toUpperCase() === 'ACTIVE');
      })
    );
  }
  getTeamMember(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${API_ROUTES.EMPLOYEE.BY_ID(id)}`);
  }

  // ── LEAVES ──
  getTeamLeaves(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.LEAVES.TEAM}`).pipe(
      map((d: any) => Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []))
    );
  }
  getTeamCalendar(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.LEAVES.TEAM_CALENDAR}`);
  }
  getTeamMemberBalance(empId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.LEAVES.TEAM_BALANCE(empId)}`);
  }
  approveLeave(id: number, comments?: string): Observable<any> {
    const body = comments ? { comments } : {};
    return this.http.put(`${this.apiUrl}${API_ROUTES.LEAVES.APPROVE(id)}`, body);
  }
  rejectLeave(id: number, comments: string): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.LEAVES.REJECT(id)}`, { comments });
  }

  // ── PERFORMANCE REVIEWS ──
  getPerformanceReviews(): Observable<any> { return this.getTeamReviews(); }
  getTeamReviews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${API_ROUTES.PERFORMANCE.TEAM_REVIEWS}`).pipe(
      map((d: any) => Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []))
    );
  }
  getTeamPendingReviews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${API_ROUTES.PERFORMANCE.TEAM_REVIEWS_PENDING}`).pipe(
      map((d: any) => Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []))
    );
  }
  getReviewById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${API_ROUTES.PERFORMANCE.REVIEW_BY_ID(id)}`);
  }
  provideFeedback(id: number, data: { managerFeedback: string; managerRating: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.PERFORMANCE.PROVIDE_FEEDBACK(id)}`, data);
  }
  submitFeedback(id: number, data: any): Observable<any> {
    const payload = {
      managerFeedback: data.managerFeedback || data.feedback,
      managerRating:   data.managerRating
    };
    return this.provideFeedback(id, payload);
  }

  // ── GOALS ──
  getGoals(): Observable<any> { return this.getTeamGoals(); }
  getTeamGoals(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${API_ROUTES.PERFORMANCE.TEAM_GOALS}`).pipe(
      map((d: any) => Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []))
    );
  }
  getTeamstausGoals(): Observable<any> {
    return this.getTeamGoals();
  }
  assignGoal(data: { employeeId: number; title: string; description: string; deadline: string; priority: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${API_ROUTES.PERFORMANCE.ASSIGN_GOAL}`, data);
  }
  createGoal(data: any): Observable<any> {
    return this.assignGoal({ ...data, title: data.title || data.description });
  }
  addGoalComment(id: number, commentOrObj: string | { comment: string }): Observable<any> {
    const body = typeof commentOrObj === 'string' ? { comment: commentOrObj } : commentOrObj;
    return this.http.put(`${this.apiUrl}${API_ROUTES.PERFORMANCE.GOAL_COMMENT(id)}`, body);
  }

  // ── NOTIFICATIONS ──
  getNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.NOTIFICATIONS.ALL}`).pipe(
      map((d: any) => Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []))
    );
  }
  getUnreadCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.NOTIFICATIONS.COUNT}`);
  }
  markNotificationRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.NOTIFICATIONS.MARK_READ(id)}`, {});
  }
  markAllRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.NOTIFICATIONS.READ_ALL}`, {});
  }

  // ── ANNOUNCEMENTS ──
  getAnnouncements(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${API_ROUTES.ADMIN.ANNOUNCEMENTS}/active`).pipe(
      map((d: any) => Array.isArray(d) ? d : (d?.content || d?.data?.content || d?.data || []))
    );
  }

  // ── HOLIDAYS ──
  getHolidays(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.HOLIDAYS_CURRENT_YEAR}`).pipe(
      map((d: any) => Array.isArray(d) ? d : (d?.content || d?.data || []))
    );
  }
}
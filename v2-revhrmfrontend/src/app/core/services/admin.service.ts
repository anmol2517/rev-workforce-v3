import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ROUTES } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // ── DASHBOARD ──────────────────────────────────────────────
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.DASHBOARD}`);
  }

  // ── EMPLOYEES ──────────────────────────────────────────────
  getEmployees(page = 0, size = 20, search?: string, departmentId?: number, status?: string): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (departmentId) params = params.set('departmentId', departmentId);
    if (status) params = params.set('status', status);
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.EMPLOYEES}`, { params });
  }

  getEmployee(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.EMPLOYEE_BY_ID(id)}`);
  }

  createEmployee(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.ADMIN.EMPLOYEES}`, data);
  }

  bulkCreateEmployees(data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.ADMIN.EMPLOYEES_BULK}`, data);
  }

  updateEmployee(id: number, data: any): Observable<any> {
  // Backend sirf ye fields accept karta hai - UpdateEmployeeRequest.java ke exact fields
  const payload: any = {};
  if (data.firstName !== undefined)     payload.firstName     = data.firstName;
  if (data.lastName !== undefined)      payload.lastName      = data.lastName;
  if (data.role !== undefined)          payload.role          = data.role;
  if (data.departmentId !== undefined)  payload.departmentId  = Number(data.departmentId);
  if (data.designationId !== undefined) payload.designationId = Number(data.designationId);
  if (data.managerId !== undefined && data.managerId !== null)
                                        payload.managerId     = Number(data.managerId);
  if (data.phone !== undefined)         payload.phone         = data.phone;
  if (data.salary !== undefined && data.salary !== '')
                                        payload.salary        = Number(data.salary);
  if (data.address !== undefined)       payload.address       = data.address;
  if (data.joiningDate !== undefined)   payload.joiningDate   = data.joiningDate;
  if (data.password !== undefined && data.password !== '')
                                        payload.password      = data.password;
  // email, departmentName, designationName mat bhejo — backend ignore karta hai
  return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.EMPLOYEE_BY_ID(id)}`, payload);
}

  activateEmployee(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.EMPLOYEE_ACTIVATE(id)}`, {});
  }

  deactivateEmployee(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.EMPLOYEE_DEACTIVATE(id)}`, {});
  }

  deleteEmployee(id: number): Observable<any> {
    return this.deactivateEmployee(id);
  }

  searchEmployees(query: string): Observable<any> {
    return this.getEmployees(0, 20, query);
  }

  assignManager(empId: number, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.EMPLOYEE_ASSIGN_MANAGER(empId)}`, body);
  }

  resetPassword(empId: number, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.EMPLOYEE_RESET_PW(empId)}`, { newPassword });
  }

  getManagersByDept(deptId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.DEPT_MANAGERS(deptId)}`);
  }

  // ── DEPARTMENTS ────────────────────────────────────────────
  getDepartments(): Observable<any> {
  return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.DEPARTMENTS}`, { params: { size: '200' } });
}

  getDepartment(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.DEPARTMENT_BY_ID(id)}`);
  }

  createDepartment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.ADMIN.DEPARTMENTS}`, data);
  }

  updateDepartment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.DEPARTMENT_BY_ID(id)}`, data);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${API_ROUTES.ADMIN.DEPARTMENT_BY_ID(id)}`);
  }
 
  // ── DESIGNATIONS ───────────────────────────────────────────
  getDesignations(): Observable<any> {
  return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.DESIGNATIONS}`, { params: { size: '200' } });
}

  createDesignation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.ADMIN.DESIGNATIONS}`, data);
  }

  updateDesignation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.DESIGNATION_BY_ID(id)}`, data);
  }

  deleteDesignation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${API_ROUTES.ADMIN.DESIGNATION_BY_ID(id)}`);
  }

  // ── LEAVES (admin) ─────────────────────────────────────────
  getAllLeaves(page = 0, size = 100, status?: string, employeeId?: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    if (employeeId) params = params.set('employeeId', employeeId);
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.LEAVES_ALL}`, { params });
  }

  approveLeave(id: number, comment: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/leaves/${id}/approve`, { comments: comment });
  }

  rejectLeave(id: number, comment: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/leaves/${id}/reject`, { comments: comment });
  }

  assignLeaveQuota(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.ADMIN.LEAVE_QUOTA}`, data);
  }

  adjustLeaveBalance(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.LEAVE_BALANCE_ADJUST}`, data);
  }

  getEmployeeLeaveBalance(empId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.LEAVE_BALANCE_EMP(empId)}`);
  }

  // ── LEAVE TYPES ────────────────────────────────────────────
  getLeaveTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.LEAVE_TYPES}`);
  }

  createLeaveType(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.ADMIN.LEAVE_TYPES}`, data);
  }

  updateLeaveType(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.LEAVE_TYPE_BY_ID(id)}`, data);
  }

  deleteLeaveType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${API_ROUTES.ADMIN.LEAVE_TYPE_BY_ID(id)}`);
  }

  // ── HOLIDAYS ───────────────────────────────────────────────
  getHolidays(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.HOLIDAYS_CURRENT_YEAR}`);
  }

  getAllHolidays(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.HOLIDAYS}`);
  }

  addHoliday(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.ADMIN.HOLIDAYS}`, data);
  }

  bulkAddHolidays(data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.ADMIN.HOLIDAYS_BULK}`, data);
  }

  updateHoliday(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.HOLIDAY_BY_ID(id)}`, data);
  }

  deleteHoliday(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${API_ROUTES.ADMIN.HOLIDAY_BY_ID(id)}`);
  }

  // ── ANNOUNCEMENTS ──────────────────────────────────────────
  getAnnouncements(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.ANNOUNCEMENTS}`);
  }

  createAnnouncement(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.ADMIN.ANNOUNCEMENTS}`, data);
  }

  updateAnnouncement(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.ANNOUNCEMENT_BY_ID(id)}`, data);
  }

  deleteAnnouncement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${API_ROUTES.ADMIN.ANNOUNCEMENT_BY_ID(id)}`);
  }

  // ── ADMIN PROFILE ──────────────────────────────────────────
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.PROFILE}`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${API_ROUTES.ADMIN.PROFILE}`, data);
  }

  // ── ACTIVITY LOGS ──────────────────────────────────────────
  getActivityLogs(page = 0, size = 20): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.apiUrl}${API_ROUTES.ADMIN.ACTIVITY_LOGS}`, { params });
  }

  // ── GOALS (admin) ──────────────────────────────────────────
  getAllGoals(): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/performance/goals/team`);
}

  // ── EXPORT METHODS ─────────────────────────────────────────
  exportEmployeePdf(employeeId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/api/employees/${employeeId}/me/report`,
      { responseType: 'blob' }
    );
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/api/admin/employees/export`,
      { responseType: 'blob' }
    );
  }
} 
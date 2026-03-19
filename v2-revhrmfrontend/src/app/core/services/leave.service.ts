import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getLeaveTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/admin/leave-types/active`);
  }

  // alias for backward compat
  getstausTypes(): Observable<any[]> {
    return this.getLeaveTypes();
  }

  getHolidays(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/admin/holidays/current-year`);
  }
}

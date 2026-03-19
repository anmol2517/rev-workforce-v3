export interface User {
  employeeId: number;
  empCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  departmentId?: number;
  departmentName?: string;
  designationId?: number;
  designationName?: string;
  managerId?: number;
  managerName?: string;
  joiningDate?: string;
  salary?: number;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface Department {
  departmentId: number;
  name: string;
  description?: string;
}

export interface Designation {
  designationId: number;
  name: string;
  level?: string;
  description?: string;
}

export interface LeaveType {
  leaveTypeId?: number;
  name: string;
  description?: string;
  defaultDays?: number;
  isActive: boolean;
}

export interface LeaveApplication {
  leaveId: number;
  employeeId: number;
  employeeName?: string;
  employee?: any;
  managerId?: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  managerComments?: string;
  approverName?: string;
  approvalComment?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  appliedAt?: string;
}

export interface LeaveBalance {
  employeeId: number;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}

export interface Holiday {
  holidayId: number;
  name: string;
  date: string;
  description?: string;
  type?: string;
  isOptional?: boolean;
  optional?: boolean;
}

export interface PerformanceReview {
  reviewId: number;
  employeeId: number;
  employeeName?: string;
  managerId?: number;
  reviewYear: any;
  keyDeliverables?: string;
  accomplishments?: string;
  areasOfImprovement?: string;
  selfRating?: number;
  managerFeedback?: string;
  managerRating?: number;
  status: 'DRAFT' | 'SUBMITTED' | 'FEEDBACK_PROVIDED' | 'COMPLETED';
  submittedAt?: string;
  feedbackProvidedAt?: string;
}

export interface Goal {
  goalId: number;
  employeeId: number;
  employee?: any;
  managerId?: number;
  title: string;
  description?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  progressPercent: number;
  managerComments?: string;
  assignedByManager: boolean;
  year: number;
}

export interface Announcement {
  announcementId: number;
  title: string;
  content: string;
  staus: boolean;
  isActive?: boolean;
  createdBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  notificationId: number;
  recipientUserId: number;
  title: string;
  message: string;
  type: string;
  referenceId?: string;
  referenceType?: string;
  read: boolean;
  readAt?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  userId: number;
  email: string;
  employeeCode?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

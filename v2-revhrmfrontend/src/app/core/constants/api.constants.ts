// ============================================================
// API ROUTES — mapped to actual backend controller paths
// Gateway runs on port 8000, routes to microservices via Eureka
// ============================================================

export const API_ROUTES = {

  // ── AUTH SERVICE (/api/auth) ────────────────────────────────
  AUTH: {
    LOGIN:           '/api/auth/login',
    REFRESH:         '/api/auth/refresh',
    CHANGE_PASSWORD: '/api/auth/change-password',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD:  '/api/auth/reset-password',
  },

  // ── EMPLOYEE SERVICE (/api/employees) ──────────────────────
  // Used by employee-role users via JWT (X-User-Id auto set by gateway)
  EMPLOYEE: {
    ME:             '/api/employees/me',
    ME_UPDATE:      '/api/employees/me',
    ME_REPORT:      '/api/employees/me/report',
    BY_ID:          (id: number) => `/api/employees/${id}`,
    DIRECTORY:      '/api/employees/directory',
    MANAGER_TEAM:   '/api/employees/manager/team',
  },

  // ── LEAVE SERVICE (/api/leaves) ────────────────────────────
  LEAVES: {
    // Employee
    APPLY:           '/api/leaves/apply',
    MY:              '/api/leaves/my',
    BY_ID:           (id: number) => `/api/leaves/${id}`,
    CANCEL:          (id: number) => `/api/leaves/${id}/cancel`,
    BALANCE:         '/api/leaves/balance',

    // Manager
    TEAM:            '/api/leaves/team',
    TEAM_CALENDAR:   '/api/leaves/team/calendar',
    TEAM_BALANCE:    (empId: number) => `/api/leaves/team/balance/${empId}`,
    APPROVE:         (id: number) => `/api/leaves/${id}/approve`,
    REJECT:          (id: number) => `/api/leaves/${id}/reject`,

    // Admin / internal
    ALL:             '/api/leaves/internal/all',
    PENDING_COUNT:   '/api/leaves/internal/pending/count',
    REPORT:          '/api/leaves/internal/report',
    QUOTA_ASSIGN:    '/api/leaves/internal/balance/assign',
    BALANCE_ADJUST:  '/api/leaves/internal/balance/adjust',
    BALANCE_BY_EMP:  (empId: number) => `/api/leaves/internal/balance/${empId}`,
  },

  // ── PERFORMANCE SERVICE (/api/performance) ─────────────────
  PERFORMANCE: {
    // Employee
    CREATE_REVIEW:    '/api/performance/reviews',
    MY_REVIEWS:       '/api/performance/reviews/my',
    REVIEW_BY_ID:     (id: number) => `/api/performance/reviews/${id}`,
    SUBMIT_REVIEW:    (id: number) => `/api/performance/reviews/${id}/submit`,
    MY_GOALS:         '/api/performance/goals/my',
    MY_GOALS_YEAR:    (year: number) => `/api/performance/goals/my/year/${year}`,
    MY_ASSIGNED_GOALS: '/api/performance/goals/my/assigned',
    GOAL_BY_ID:       (id: number) => `/api/performance/goals/${id}`,
    CREATE_GOAL:      '/api/performance/goals',
    UPDATE_PROGRESS:  (id: number) => `/api/performance/goals/${id}/progress`,

    // Manager
    TEAM_REVIEWS:     '/api/performance/reviews/team',
    TEAM_REVIEWS_PENDING: '/api/performance/reviews/team/pending',
    PROVIDE_FEEDBACK: (id: number) => `/api/performance/reviews/${id}/feedback`,
    TEAM_GOALS:       '/api/performance/goals/team',
    TEAM_GOALS_staus:'/api/performance/goals/team/staus',
    ASSIGN_GOAL:      '/api/performance/goals/assign',
    GOAL_COMMENT:     (id: number) => `/api/performance/goals/${id}/comment`,
  },

  // ── NOTIFICATION SERVICE (/api/notifications) ──────────────
  NOTIFICATIONS: {
    ALL:       '/api/notifications',
    UNREAD:    '/api/notifications/unread',
    COUNT:     '/api/notifications/unread/count',
    MARK_READ: (id: number) => `/api/notifications/${id}/read`,
    READ_ALL:  '/api/notifications/read-all',
  },

  // ── ADMIN SERVICE (/api/admin) ─────────────────────────────
  ADMIN: {
    // Dashboard
    DASHBOARD:          '/api/admin/dashboard',

    // Employees
    EMPLOYEES:                          '/api/admin/employees',
    EMPLOYEE_BY_ID:     (id: number) => `/api/admin/employees/${id}`,
    EMPLOYEE_DEACTIVATE:(id: number) => `/api/admin/employees/${id}/deactivate`,
    EMPLOYEE_ACTIVATE:  (id: number) => `/api/admin/employees/${id}/activate`,
    EMPLOYEE_ASSIGN_MANAGER: (id: number) => `/api/admin/employees/${id}/assign-manager`,
    EMPLOYEE_RESET_PW:  (id: number) => `/api/admin/employees/${id}/reset-password`,
    EMPLOYEES_BULK:     '/api/admin/employees/bulk',
    DEPT_MANAGERS:      (deptId: number) => `/api/admin/employees/department/${deptId}/managers`,

    // Departments
    DEPARTMENTS:                         '/api/admin/departments',
    DEPARTMENT_BY_ID:   (id: number) =>  `/api/admin/departments/${id}`,

    // Designations
    DESIGNATIONS:                        '/api/admin/designations',
    DESIGNATION_BY_ID:  (id: number) =>  `/api/admin/designations/${id}`,

    // Leaves
    LEAVES_ALL:         '/api/admin/leaves',
    LEAVES_REPORT:      '/api/admin/leaves/report',
    LEAVE_QUOTA:        '/api/admin/leaves/quota',
    LEAVE_BALANCE_ADJUST: '/api/admin/leaves/balance/adjust',
    LEAVE_BALANCE_EMP:  (id: number) => `/api/admin/leaves/balance/employee/${id}`,

    // Leave Types
    LEAVE_TYPES:                         '/api/admin/leave-types',
    LEAVE_TYPE_BY_ID:   (id: number) =>  `/api/admin/leave-types/${id}`,

    // Holidays
    HOLIDAYS:                            '/api/admin/holidays',
    HOLIDAYS_CURRENT_YEAR: '/api/admin/holidays/current-year',
    HOLIDAY_BY_ID:      (id: number) =>  `/api/admin/holidays/${id}`,
    HOLIDAYS_BULK:      '/api/admin/holidays/bulk',

    // Announcements
    ANNOUNCEMENTS:                       '/api/admin/announcements',
    ANNOUNCEMENT_BY_ID: (id: number) =>  `/api/admin/announcements/${id}`,

    // Profile
    PROFILE:            '/api/admin/profile',

    // Activity logs
    ACTIVITY_LOGS:      '/api/admin/activity-logs',
  }
};

export const ROLES = {
  ADMIN:    'ADMIN',
  MANAGER:  'MANAGER',
  EMPLOYEE: 'EMPLOYEE'
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'rw_token',
  USER:  'rw_user'
} as const;

import { Routes } from '@angular/router';
import { adminGuard, managerGuard, employeeGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'employees', loadComponent: () => import('./features/admin/employees/employees.component').then(m => m.EmployeesComponent) },
      { path: 'departments', loadComponent: () => import('./features/admin/departments/departments.component').then(m => m.DepartmentsComponent) },
      { path: 'designations', loadComponent: () => import('./features/admin/designations/designations.component').then(m => m.DesignationsComponent) },
      { path: 'leaves', loadComponent: () => import('./features/admin/leaves/admin-leaves.component').then(m => m.AdminLeavesComponent) },
      { path: 'holidays', loadComponent: () => import('./features/admin/holidays/holidays.component').then(m => m.HolidaysComponent) },
      { path: 'announcements', loadComponent: () => import('./features/admin/announcements/admin-announcements.component').then(m => m.AdminAnnouncementsComponent) },
      { path: 'profile', loadComponent: () => import('./features/admin/profile/admin-profile.component').then(m => m.AdminProfileComponent) },
      { path: 'view-profile', loadComponent: () => import('./features/admin/view-profile/admin-view-profile.component').then(m => m.AdminViewProfileComponent) },
      { path: 'goals', loadComponent: () => import('./features/admin/goals/admin-goals.component').then(m => m.AdminGoalsComponent) },
      { path: 'left-employees', loadComponent: () => import('./features/admin/left-employees/left-employees.component').then(m => m.LeftEmployeesComponent) },
    ]
  },
  {
    path: 'manager',
    canActivate: [managerGuard],
    loadComponent: () =>
      import('./features/manager/layout/manager-layout.component').then(m => m.ManagerLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/manager/dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent) },
      { path: 'team', loadComponent: () => import('./features/manager/team/team.component').then(m => m.TeamComponent) },
      { path: 'leaves', loadComponent: () => import('./features/manager/leaves/manager-leaves.component').then(m => m.ManagerLeavesComponent) },
      { path: 'performance-reviews', loadComponent: () => import('./features/manager/performance-reviews/manager-reviews.component').then(m => m.ManagerReviewsComponent) },
      { path: 'goals', loadComponent: () => import('./features/manager/goals/manager-goals.component').then(m => m.ManagerGoalsComponent) },
      { path: 'announcements', loadComponent: () => import('./features/manager/announcements/manager-announcements.component').then(m => m.ManagerAnnouncementsComponent) },
      { path: 'holidays', loadComponent: () => import('./features/manager/holidays/manager-holidays.component').then(m => m.ManagerHolidaysComponent) },
      { path: 'profile', loadComponent: () => import('./features/manager/profile/manager-profile.component').then(m => m.ManagerProfileComponent) },
      { path: 'view-employee/:id', loadComponent: () => import('./features/manager/view-employee/manager-view-employee.component').then(m => m.ManagerViewEmployeeComponent) },
      { path: 'notifications', loadComponent: () => import('./features/employee/notifications/employee-notifications.component').then(m => m.EmployeeNotificationsComponent) },
    ]
  },
  {
    path: 'employee',
    canActivate: [employeeGuard],
    loadComponent: () =>
      import('./features/employee/layout/employee-layout.component').then(m => m.EmployeeLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/employee/dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./features/employee/profile/employee-profile.component').then(m => m.EmployeeProfileComponent) },
      { path: 'leaves', loadComponent: () => import('./features/employee/leaves/employee-leaves.component').then(m => m.EmployeeLeavesComponent) },
      { path: 'performance-reviews', loadComponent: () => import('./features/employee/performance-reviews/employee-reviews.component').then(m => m.EmployeeReviewsComponent) },
      { path: 'goals', loadComponent: () => import('./features/employee/goals/employee-goals.component').then(m => m.EmployeeGoalsComponent) },
      { path: 'announcements', loadComponent: () => import('./features/employee/announcements/employee-announcements.component').then(m => m.EmployeeAnnouncementsComponent) },
      { path: 'directory', loadComponent: () => import('./features/employee/directory/employee-directory.component').then(m => m.EmployeeDirectoryComponent) },
      { path: 'notifications', loadComponent: () => import('./features/employee/notifications/employee-notifications.component').then(m => m.EmployeeNotificationsComponent) },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
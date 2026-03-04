import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Link } from './features/link/link';
import { Design } from './features/design/design';
import { Account } from './features/account/account';
import { Insight } from './features/insight/insight';
import { AuthGuard } from './core/guards/auth';
import { AdminAuthGuard } from './core/guards/admin-auth.guard';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { User } from './features/dashboard/user/user';
import { LinkComponent } from './features/dashboard/link/link';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/auth/login/login').then((m) => m.AdminLogin),
  },
  {
    path: 'username',
    loadComponent: () => import('./features/username/username').then((m) => m.Username),
  },
  // {
  //   path: 'home',
  //   loadComponent: () => import('./features/home/home').then((m) => m.Home),
  // },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/dashboard/dashboard').then((m) => m.dashboardLayout),
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'links', pathMatch: 'full' },
      {
        path: 'links',
        component: Link,
        data: { name: 'Links', rightSidebar: true },
      },
      {
        path: 'design',
        component: Design,
        data: { name: 'Design', rightSidebar: true },
      },
      {
        path: 'account',
        component: Account,
        data: { name: 'Account', rightSidebar: false },
      },
    ],
  },

  {
    path: 'admindashboard',
    loadComponent: () =>
      import('./layout/admindashboard/admindashboard').then((m) => m.admindashboardLayout),
    // canActivate: [AdminAuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, data: { name: 'Dashboard' } },
      { path: 'user', component: User, data: { name: 'Users' } },
      { path: 'link', component: LinkComponent, data: { name: 'links' } },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
];

import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Link } from './features/link/link';
import { Design } from './features/design/design';
import { Account } from './features/account/account';
import { dashboardLayout } from './layout/dashboad/dashboard';
import { Insight } from './features/insight/insight';
import { AuthGuard } from './core/guards/auth';

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
    path: 'username',
    loadComponent: () => import('./features/username/username').then((m) => m.Username),
  },
  {
    path: 'home',
    loadComponent: () => import('./layout/home/home').then((m) => m.HomeLayout),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/dashboad/dashboard').then((m) => m.dashboardLayout),
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
        path: 'insight',
        component: Insight,
        data: { name: 'Insights', rightSidebar: false },
      },
      {
        path: 'account',
        component: Account,
        data: { name: 'Account', rightSidebar: false },
      },
    ],
  },
];

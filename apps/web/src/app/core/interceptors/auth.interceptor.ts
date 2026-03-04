import { UserResponse } from '@linktree/validation';
import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_USER_KEY = 'auth_user';
const AUTH_ADMIN_KEY = 'auth_admin';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Admin routes: use admin token
  const isAdminRoute =
    req.url.includes('/admin/') &&
    !req.url.includes('/admin/auth/login') &&
    !req.url.includes('/admin/auth/register');
  if (isAdminRoute) {
    const adminRaw = localStorage.getItem(AUTH_ADMIN_KEY);
    if (adminRaw) {
      const admin: { token?: string } = JSON.parse(adminRaw);
      if (admin?.token) {
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${admin.token}` },
          }),
        );
      }
    }
    return next(req);
  }

  const raw = localStorage.getItem('auth_user');
  if (!raw) {
    return next(req);
  }
  const user: UserResponse = JSON.parse(raw);

  // skip public endpoints
  if (!user.token || req.url.includes('/auth/login')) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return next(authReq);
};

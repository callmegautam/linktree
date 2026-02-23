import { UserResponse } from '@linktree/validation';
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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

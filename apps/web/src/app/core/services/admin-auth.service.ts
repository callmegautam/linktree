import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AdminLogin as AdminLoginBody,
  AdminResponse,
  CreateAdminBody,
} from '@linktree/validation';
import { ApiResponse } from '@linktree/shared-types';
import { Observable, tap } from 'rxjs';
import { AdminAuthStore } from '@/app/store/admin-auth';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private readonly API_URL = `${environment.apicall}/admin/auth`;

  constructor(
    private http: HttpClient,
    private adminAuthStore: AdminAuthStore,
  ) {}

  login(payload: AdminLoginBody): Observable<ApiResponse<AdminResponse>> {
    return this.http
      .post<ApiResponse<AdminResponse>>(`${this.API_URL}/login`, payload)
      .pipe(tap((res) => res.data && this.adminAuthStore.setAdmin(res.data)));
  }

  register(payload: CreateAdminBody): Observable<ApiResponse<AdminResponse>> {
    return this.http
      .post<ApiResponse<AdminResponse>>(`${this.API_URL}/register`, payload)
      .pipe(tap((res) => res.data && this.adminAuthStore.setAdmin(res.data)));
  }

  logout(): void {
    this.adminAuthStore.clear();
  }
}

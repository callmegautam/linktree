import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@linktree/shared-types';
import { AdminUsersResponse } from '@linktree/validation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private readonly API_URL: string = `${environment.apicall}/admin/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiResponse<AdminUsersResponse[]>> {
    return this.http.get<ApiResponse<AdminUsersResponse[]>>(`${this.API_URL}`);
  }

  toggleUserStatus(
    userId: string,
    status: 'block' | 'unblock',
  ): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.API_URL}/${userId}/status/${status}`,
      {},
    );
  }
}

import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@linktree/shared-types';
import { AnalyticsResponse } from '@linktree/validation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly API_URL: string = `${environment.apicall}/admin/analytics`;

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<ApiResponse<AnalyticsResponse>> {
    return this.http.get<ApiResponse<AnalyticsResponse>>(`${this.API_URL}`);
  }
}

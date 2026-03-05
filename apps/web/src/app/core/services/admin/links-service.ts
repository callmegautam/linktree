import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@linktree/shared-types';
import { AdminLinksResponse } from '@linktree/validation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminLinksService {
  private readonly API_URL: string = `${environment.apicall}/admin/links`;

  constructor(private http: HttpClient) {}

  getLinks(): Observable<ApiResponse<AdminLinksResponse[]>> {
    return this.http.get<ApiResponse<AdminLinksResponse[]>>(`${this.API_URL}`);
  }

  toggleLinkStatus(
    linkId: string,
    status: 'block' | 'unblock',
  ): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.API_URL}/${linkId}/status/${status}`,
      {},
    );
  }

  deleteLink(linkId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.API_URL}/${linkId}`,
    );
  }
}

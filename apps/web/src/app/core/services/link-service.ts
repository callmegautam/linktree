import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateLinkBody, LinkResponse, UpdateLinkBody } from '@linktree/validation';
import { Link } from '@/app/features/link/link';
import { ApiResponse } from '@linktree/shared-types';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private readonly API_URL: string = `${environment.apicall}/link`;

  constructor(private http: HttpClient) {}

  createLink(payload: CreateLinkBody): Observable<ApiResponse<LinkResponse>> {
    return this.http.post<ApiResponse<LinkResponse>>(`${this.API_URL}/`, payload);
  }

  getLink(): Observable<ApiResponse<LinkResponse[]>> {
    return this.http.get<ApiResponse<LinkResponse[]>>(`${this.API_URL}/`);
  }

  updateLink(id: string, payload: UpdateLinkBody): Observable<ApiResponse<LinkResponse>> {
    return this.http.put<ApiResponse<LinkResponse>>(`${this.API_URL}/${id}`, payload);
  }

  deleteLink(id: string): Observable<ApiResponse<LinkResponse>> {
    return this.http.delete<ApiResponse<LinkResponse>>(`${this.API_URL}/${id}`);
  }
}

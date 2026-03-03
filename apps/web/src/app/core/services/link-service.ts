import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateLinkBody, LinkResponse } from '@linktree/validation';
import { Link } from '@/app/features/link/link';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private readonly API_URL: string = `${environment.apicall}/link`;

  constructor(private http: HttpClient) {}

  createLink(payload: CreateLinkBody): Observable<LinkResponse> {
    return this.http.post<LinkResponse>(`${this.API_URL}/`, payload);
  }
}

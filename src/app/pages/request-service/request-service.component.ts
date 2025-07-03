import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private baseUrl = 'http://192.168.5.200:60776';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    console.log('[DEBUG] Token dipakai:', token); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getRequestById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('[DEBUG] GET Request ID:', id); 
    return this.http.get<any>(`${this.baseUrl}/api/Request/${id}`, { headers });
  }

  getFile(filename: string): Observable<Blob> {
    const headers = this.getAuthHeaders();
    console.log('[DEBUG] GET File:', filename); 
    return this.http.get(`${this.baseUrl}/api/Request/GetFile/${encodeURIComponent(filename)}`, { headers, responseType: 'blob' });
  }
}

// src/app/services/request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = environment.apiUrl;
  private requestUrl = `${this.baseUrl}/Request`;
  private equipmentUrl = `${this.baseUrl}/Equipment`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.requestUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.requestUrl}/${id}`);
  }

  getRequestById(id: string): Observable<any> {
    return this.getById(id);
  }

  create(formData: FormData): Observable<any> {
    return this.http.post(this.requestUrl, formData, {
      responseType: 'text'
    });
  }

  updateStatus(payload: any): Observable<any> {
    return this.http.post(`${this.requestUrl}/updateStatus`, payload, {
      responseType: 'text'
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.requestUrl}/${id}`, {
      responseType: 'text'
    });
  }

  getFile(capture: string): Observable<Blob> {
    return this.http.get(`${this.requestUrl}/GetFile/${capture}`, {
      responseType: 'blob'
    });
  }

  getEquipments(): Observable<any[]> {
    return this.http.get<any[]>(this.equipmentUrl);
  }
}

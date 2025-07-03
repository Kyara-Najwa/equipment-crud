import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class RequestComponent implements OnInit {
  searchId: string = '';
  requests: any[] = [];
  imageUrls: { [key: string]: string } = {};
  baseUrl = 'http://192.168.5.200:60776';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  loadRequests(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${this.baseUrl}/api/Request`, { headers }).subscribe({
      next: data => {
        this.requests = data;
        this.requests.forEach(req => this.loadImageWithToken(req.capture));
      },
      error: () => {
        alert('Gagal mengambil data request.');
      }
    });
  }

  loadImageWithToken(capture: string): void {
    const headers = this.getAuthHeaders();
    this.http.get(`${this.baseUrl}/api/Request/GetFile/${capture}`, {
      headers,
      responseType: 'blob'
    }).subscribe({
      next: blob => {
        if (blob.size === 0 || blob.type === 'application/json') {
          this.imageUrls[capture] = 'https://i.imgur.com/LtYp3jp.jpeg';
        } else {
          this.imageUrls[capture] = URL.createObjectURL(blob);
        }
      },
      error: () => {
        this.imageUrls[capture] = 'https://i.imgur.com/LtYp3jp.jpeg';
      }
    });
  }

  searchRequest(): void {
    if (!this.searchId.trim()) {
      this.loadRequests();
    } else {
      const headers = this.getAuthHeaders();
      this.http.get<any>(`${this.baseUrl}/api/Request/${this.searchId}`, { headers }).subscribe({
        next: data => {
          this.requests = [data];
          this.loadImageWithToken(data.capture);
        },
        error: () => {
          alert('Data tidak ditemukan atau ID salah.');
          this.requests = [];
        }
      });
    }
  }

  deleteRequest(id: number): void {
    if (!confirm(`Yakin ingin menghapus request ID ${id}?`)) return;

    const headers = this.getAuthHeaders();
    this.http.delete(`${this.baseUrl}/api/Request/${id}`, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: () => {
        alert('Request berhasil dihapus!');
        this.loadRequests();
      },
      error: () => {
        alert('Gagal menghapus request.');
      }
    });
  }

  onImageError(event: any): void {
    event.target.src = 'https://i.imgur.com/LtYp3jp.jpeg';
  }
}

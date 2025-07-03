import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = null;
  loading = true;
  error = '';

  passwordData = {
    oldPassword: '',
    newPassword: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId || isNaN(Number(userId))) {
      this.error = 'ID pengguna tidak valid.';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(`http://192.168.5.200:60776/api/User/${userId}`, { headers }).subscribe({
      next: res => {
        this.userData = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Gagal mengambil data profil.';
        this.loading = false;
      }
    });
  }

  changePassword(): void {
    const token = localStorage.getItem('token');

    if (!this.passwordData.oldPassword.trim() || !this.passwordData.newPassword.trim()) {
      alert('Semua field wajib diisi.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });

    const body = {
      OldPassword: this.passwordData.oldPassword,
      NewPassword: this.passwordData.newPassword
    };

    this.http.post('http://192.168.5.200:60776/api/User/ChangePassword', body, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: () => {
        alert('Password berhasil diganti.');
        this.passwordData = { oldPassword: '', newPassword: '' };
        localStorage.clear();
        window.location.href = '/login';
      },
      error: (err) => {
        if (err.status === 400) {
          alert('Password lama salah atau format password baru tidak valid.');
        } else {
          alert(`Terjadi kesalahan. Status ${err.status}: ${err.statusText}`);
        }
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService, UserData } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
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

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');

    if (userRaw) {
    const parsedUser: UserData = JSON.parse(userRaw);
    this.authService.setUser(parsedUser);
    }


    if (!token || !userRaw) {
      this.error = 'Kamu belum login.';
      this.loading = false;
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      const userId = user.userId;

      this.profileService.getUserProfile(userId).subscribe({
        next: (res) => {
          this.userData = res;
          localStorage.setItem('user', JSON.stringify(res));
          this.loading = false;
        },
        error: () => {
          this.error = 'Gagal mengambil data profil.';
          this.loading = false;
        }
      });
    } catch (_) {
      this.error = 'Gagal membaca data user.';
      this.loading = false;
    }
  }

  changePassword(): void {
    const token = localStorage.getItem('token') || '';

    if (!this.passwordData.oldPassword.trim() || !this.passwordData.newPassword.trim()) {
      alert('Semua field wajib diisi.');
      return;
    }

    this.profileService.changePassword(
      this.passwordData.oldPassword,
      this.passwordData.newPassword
    ).subscribe({
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
          alert(`Terjadi kesalahan, status ${err.status}: ${err.statusText}`);
        }
      }
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

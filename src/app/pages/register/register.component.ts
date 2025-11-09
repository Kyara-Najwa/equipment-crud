import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ⬅️ Tambahkan ini

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = {
    emailAddress: '',
    password: '',
    fullName: '',
    companyName: '',
    telp: '',
    roleId: 2,
    latitude: null,
    longitude: null
  };

  constructor(
    private router: Router,
    private authService: AuthService // ⬅️ Tambahkan ini
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser?.roleName) {
          this.router.navigate(['/equipment']);
        }
      } catch (_) {}
    }
  }

  getUserLocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation tidak didukung browser');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error.message)
    );
  });
}


  registerUser(): void {
    const u = this.user;
    if (!u.emailAddress.trim() || !u.password.trim() || !u.fullName.trim() || !u.companyName.trim() || !u.telp.trim()) {
      alert('Semua field wajib diisi.');
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        alert('Pendaftaran berhasil! Silakan login.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Email sudah digunakan.');
        } else if (err.status === 400) {
          alert('Data tidak valid.');
        } else {
          alert(`Gagal mendaftar. Status: ${err.status} - ${err.statusText}`);
        }
      }
    });
  }
}

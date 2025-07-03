import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

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
    roleId: 2
  };

  constructor(private http: HttpClient, private router: Router) {}

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

  registerUser(): void {
    if (
      !this.user.emailAddress.trim() ||
      !this.user.password.trim() ||
      !this.user.fullName.trim() ||
      !this.user.companyName.trim() ||
      !this.user.telp.trim()
    ) {
      alert('Semua field wajib diisi.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = 'http://192.168.5.200:60776/api/General/Register';

    this.http.post(url, this.user, {
      headers,
      responseType: 'text'
    }).subscribe({
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

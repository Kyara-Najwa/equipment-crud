import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

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
    roleId: 2,       // Default sebagai user biasa
    roleName: 'User',
    salt: '',
    id: 0
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/equipment']);
    }
  }

  registerUser(): void {
    // Validasi semua field wajib
    if (
      !this.user.emailAddress.trim() ||
      !this.user.password.trim() ||
      !this.user.fullName.trim() ||
      !this.user.companyName.trim() ||
      !this.user.telp.trim()
    ) {
      alert('❌ Semua field wajib diisi.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Sesuaikan ke endpoint baru
    const url = 'http://192.168.5.200:60776/api/General/Register';

    const body = {
      id: 0,
      emailAddress: this.user.emailAddress,
      password: this.user.password,
      fullName: this.user.fullName,
      companyName: this.user.companyName,
      telp: this.user.telp,
      salt: '',
      roleId: this.user.roleId,
      roleName: this.user.roleName
    };

    this.http.post(url, body, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: () => {
        alert('✅ Pendaftaran berhasil! Silakan login.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('❌ Error dari server:', err);
        if (err.status === 409) {
          alert('⚠️ Email sudah digunakan.');
        } else if (err.status === 400) {
          alert('⚠️ Data tidak valid.');
        } else {
          alert(`❌ Gagal mendaftar. Status: ${err.status} - ${err.statusText}`);
        }
      }
    });
  }
}

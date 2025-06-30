import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  editUserId: number | null = null;
  editedUser: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    this.http.get<any[]>('http://192.168.5.200:60776/api/User', { headers }).subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        console.error('❌ Gagal mengambil data user:', err);
        alert('❌ Gagal mengambil data user.');
      }
    });
  }

  startEdit(user: any): void {
    this.editUserId = user.id;
    this.editedUser = { ...user };
  }

  cancelEdit(): void {
    this.editUserId = null;
    this.editedUser = {};
  }

  saveEdit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      id: this.editedUser.id,
      emailAddress: this.editedUser.emailAddress,
      fullName: this.editedUser.fullName,
      companyName: this.editedUser.companyName,
      telp: this.editedUser.telp,
      roleId: this.editedUser.roleId
    };

    this.http.put('http://192.168.5.200:60776/api/User', payload, {
      headers,
      responseType: 'text'  // ✅ FIX untuk menghindari parse error jika server kirim "Success"
    }).subscribe({
      next: () => {
        alert('✅ Data user berhasil diperbarui.');
        this.editUserId = null;
        this.fetchUsers();
      },
      error: (err) => {
        console.error('❌ Gagal update user:', err);
        alert('❌ Gagal update user.');
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });

    this.http.request('DELETE', `http://192.168.5.200:60776/api/User/${id}`, {
      headers,
      responseType: 'text'  // ✅ Wajib kalau backend balikin "Success" sebagai string biasa
    }).subscribe({
      next: () => {
        alert('🗑️ User berhasil dihapus.');
        this.fetchUsers();
      },
      error: (err) => {
        console.error('❌ Gagal hapus user:', err);
        const status = err.status || 'Unknown';
        const message = err.error?.message || err.statusText || 'Terjadi kesalahan saat menghapus user.';
        alert(`❌ Gagal menghapus user. Status: ${status} - ${message}`);
      }
    });
  }
}

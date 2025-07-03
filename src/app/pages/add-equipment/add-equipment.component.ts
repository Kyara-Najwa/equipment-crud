import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-equipment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.css']
})
export class AddEquipmentComponent {
  newEquipment = {
    equipment: 1,
    modelName: '',
    description: '',
    location: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  addEquipment() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    const payload = { ...this.newEquipment };

    this.http.post('http://192.168.5.200:60776/api/Equipment', payload, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: () => {
        alert('Equipment berhasil ditambahkan!');
        this.newEquipment = {
          equipment: 1,
          modelName: '',
          description: '',
          location: ''
        };
        this.router.navigate(['/equipment']);
      },
      error: () => {
        alert('Gagal menambahkan equipment.');
      }
    });
  }
}

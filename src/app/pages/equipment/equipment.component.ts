import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit, OnDestroy {
  equipmentList: any[] = [];
  intervalId: any;

  newEquipment = {
    equipment: null,
    modelName: '',
    description: '',
    location: ''
  };

  editingEquipmentId: number | null = null;

  editEquipment = {
    equipment: null,
    modelName: '',
    description: '',
    location: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
    this.intervalId = setInterval(() => this.fetchData(), 15000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  fetchData(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    this.http.get<any[]>('http://192.168.5.200:60776/api/Equipment', { headers })
      .subscribe({
        next: res => this.equipmentList = res,
        error: err => console.error('Gagal ambil data equipment:', err)
      });
  }

  addEquipment(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    const payload = { id: 0, ...this.newEquipment };

    this.http.post('http://192.168.5.200:60776/api/Equipment', payload, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: () => {
        alert('Equipment berhasil ditambahkan!');
        this.newEquipment = { equipment: null, modelName: '', description: '', location: '' };
        this.fetchData();
      },
      error: () => alert('Gagal tambah equipment.')
    });
  }

  deleteEquipment(id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    if (!confirm('Yakin ingin menghapus data ini?')) return;

    this.http.delete(`http://192.168.5.200:60776/api/Equipment/${id}`, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: () => {
        alert('Equipment berhasil dihapus!');
        this.fetchData();
      },
      error: () => alert('Gagal hapus equipment.')
    });
  }

  startEdit(item: any): void {
    this.editingEquipmentId = item.id;
    this.editEquipment = {
      equipment: item.equipment,
      modelName: item.modelName,
      description: item.description,
      location: item.location
    };
  }

  cancelEdit(): void {
    this.editingEquipmentId = null;
  }

  saveEdit(id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    const updatedData = { id, ...this.editEquipment };

    this.http.put('http://192.168.5.200:60776/api/Equipment', updatedData, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: () => {
        alert('Equipment berhasil diperbarui!');
        this.editingEquipmentId = null;
        this.fetchData();
      },
      error: () => alert('Gagal update equipment.')
    });
  }
}

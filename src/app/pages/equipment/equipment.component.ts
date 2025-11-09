import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentService } from '../../services/equipment.service';

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

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.fetchData();
    this.intervalId = setInterval(() => this.fetchData(), 15000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  fetchData(): void {
    this.equipmentService.getAll().subscribe({
      next: res => this.equipmentList = res,
      error: err => console.error('Gagal ambil data equipment:', err)
    });
  }

  addEquipment(): void {
    this.equipmentService.add(this.newEquipment).subscribe({
      next: () => {
        alert('Equipment berhasil ditambahkan!');
        this.newEquipment = { equipment: null, modelName: '', description: '', location: '' };
        this.fetchData();
      },
      error: () => alert('Gagal tambah equipment.')
    });
  }

  deleteEquipment(id: number): void {
    if (!confirm('Yakin ingin menghapus data ini?')) return;

    this.equipmentService.delete(id).subscribe({
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
    const updatedData = { id, ...this.editEquipment };

    this.equipmentService.update(updatedData).subscribe({
      next: () => {
        alert('Equipment berhasil diperbarui!');
        this.editingEquipmentId = null;
        this.fetchData();
      },
      error: () => alert('Gagal update equipment.')
    });
  }
}

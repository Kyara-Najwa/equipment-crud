// src/app/pages/request/request.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  searchId: string = '';
  requests: any[] = [];

  selectedStatus: string = 'All';
  statusOptions: string[] = ['All', 'Open', 'On Process', 'Reject', 'Close'];

  statusMap: { [label: string]: string } = {
    All: '0',
    Open: '1',
    'On Process': '2',
    Reject: '4',
    Close: '3'
  };

  statusLabelMap: { [statusCode: string]: string } = {
    '1': 'Open',
    '2': 'On Process',
    '3': 'Close',
    '4': 'Reject'
  };

  showModal: boolean = false;
  noteInput: string = '';
  selectedRequest: any = null;
  rejectMode: boolean = false;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService.getAll().subscribe({
      next: data => {
        const filterValue = this.statusMap[this.selectedStatus];
        this.requests = filterValue === '0' ? data : data.filter(req => req.status === filterValue);
      },
      error: err => {
        console.error('Gagal mengambil data request:', err);
        alert('Gagal mengambil data request.');
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.loadRequests();
  }

  searchRequest(): void {
    if (!this.searchId.trim()) {
      this.loadRequests();
      return;
    }

    this.requestService.getById(this.searchId).subscribe({
      next: data => {
        const filterValue = this.statusMap[this.selectedStatus];
        const isValid = filterValue === '0' || data.status === filterValue;
        this.requests = isValid ? [data] : [];
      },
      error: err => {
        console.error('Gagal mencari request:', err);
        alert('Data tidak ditemukan atau ID salah.');
        this.requests = [];
      }
    });
  }

  deleteRequest(id: number): void {
    if (!confirm(`Yakin ingin menghapus request ID ${id}?`)) return;

    this.requestService.delete(id).subscribe({
      next: () => {
        alert('Request berhasil dihapus!');
        this.loadRequests();
      },
      error: err => {
        console.error('Gagal menghapus request:', err);
        alert('Gagal menghapus request.');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case '1': return 'status-open';
      case '2': return 'status-process';
      case '3': return 'status-close';
      case '4': return 'status-reject';
      default: return 'status-unknown';
    }
  }

  openProcessModal(req: any): void {
    this.selectedRequest = req;
    this.noteInput = '';
    this.rejectMode = false;
    this.showModal = true;
  }

  openRejectModal(req: any): void {
    this.selectedRequest = req;
    this.noteInput = '';
    this.rejectMode = true;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.noteInput = '';
    this.selectedRequest = null;
    this.rejectMode = false;
  }

  submitStatusUpdate(): void {
    if (!this.selectedRequest) return;

    const newStatus = this.rejectMode ? '4' : '2';

    const payload = {
      requestId: this.selectedRequest.id,
      status: newStatus,
      note: this.noteInput || (this.rejectMode ? 'Request rejected' : 'Request processed')
    };

    this.requestService.updateStatus(payload).subscribe({
      next: () => {
        alert(this.rejectMode ? 'Request berhasil direject!' : 'Request berhasil diproses!');
        this.closeModal();
        this.loadRequests();
      },
      error: err => {
        console.error('Gagal memperbarui status:', err);
        alert('Gagal memperbarui status request.');
      }
    });
  }

  closeRequest(req: any): void {
    if (!req || !req.id) return;

    const payload = {
      requestId: req.id,
      status: '3',
      note: 'Request closed'
    };

    this.requestService.updateStatus(payload).subscribe({
      next: () => {
        alert('Request berhasil ditandai sebagai selesai!');
        this.loadRequests();
      },
      error: err => {
        console.error('Gagal menutup request:', err);
        alert('Gagal memperbarui status ke Close.');
      }
    });
  }
}

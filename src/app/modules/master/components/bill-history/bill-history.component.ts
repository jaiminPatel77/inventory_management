import { Component } from '@angular/core';
import { InventoryService } from '../../../shared/services/inventory.service';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bill-history',
  standalone: true,
  imports: [CommonModule,NgbTooltipModule],
  templateUrl: './bill-history.component.html',
  styleUrl: './bill-history.component.scss'
})
export class BillHistoryComponent {
  bills: any[] = [];

  constructor(private medicineService: InventoryService) {}

  ngOnInit() {
    this.fetchBills();
  }

  fetchBills() {
    this.medicineService.getAllBills().subscribe({
      next: data => {
        console.log('Fetched bills:', data);
        this.bills = data;
      },
      error: err => console.error('Failed to fetch bills:', err)
    });
  }

  openBill(bill: any) {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(bill.htmlContent || '<p>No bill content available</p>');
    printWindow.document.close();
    printWindow.focus();
  } else {
    console.error('Failed to open new window');
  }
}

}

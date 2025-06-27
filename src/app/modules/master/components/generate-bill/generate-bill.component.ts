import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-generate-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.scss']
})
export class GenerateBillComponent {
  invoiceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      patientName: ['', Validators.required],
      doctorName: ['', Validators.required],
      items: this.fb.array([this.createItem(1)])
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(orderNumber: number): FormGroup {
    return this.fb.group({
      orderNumber: [orderNumber],
      itemName: ['', Validators.required],
      itemQuantity: [1, [Validators.required, Validators.min(1)]],
      itemPrice: [0, [Validators.required, Validators.min(0)]],
      itemTotal: [{ value: 0, disabled: true }]
    });
  }

  addItem(): void {
    const orderNumber = this.items.length + 1;
    this.items.push(this.createItem(orderNumber));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateOrderNumbers();
  }

  updateOrderNumbers(): void {
    this.items.controls.forEach((item, index) => {
      item.get('orderNumber')?.setValue(index + 1);
    });
  }

  calculateTotal(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('itemQuantity')?.value || 0;
    const price = item.get('itemPrice')?.value || 0;
    const total = quantity * price;
    item.get('itemTotal')?.setValue(total);
  }

  getTotalAmount(): number {
    return this.items.controls.reduce((sum, item) => {
      const qty = item.get('itemQuantity')?.value || 0;
      const price = item.get('itemPrice')?.value || 0;
      return sum + qty * price;
    }, 0);
  }

    submitInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      console.warn('Form is invalid');
      return;
    }

    const formData = {
      ...this.invoiceForm.value,
      totalAmount: this.getTotalAmount()
    };

    console.log('Invoice Submitted:', formData);
  }
}

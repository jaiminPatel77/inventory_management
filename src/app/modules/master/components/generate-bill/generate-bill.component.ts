import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InventoryService } from '../../../shared/services/inventory.service';
import { Medicine } from '../../../shared/models/medicine_model-dto';
import { BillItemDto, generateBillHtmlHelper } from '../../../shared/models/generate-bill-html-helper';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-generate-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.scss']
})
export class GenerateBillComponent {
  invoiceForm: FormGroup;
  medicines: Medicine[] = [];

  showSuggestions: boolean[] = [];
  filteredNames: string[][] = [];

  public _commonService = inject(CommonService);
  constructor(
    private fb: FormBuilder,
    private medicineService: InventoryService
  ) {
    this.invoiceForm = this.fb.group({
      patientName: ['', Validators.required],
      doctorName: ['', Validators.required],
      items: this.fb.array([this.createItem(1)])
    });

    // Initialize showSuggestions and filteredNames for the first row
    this.showSuggestions.push(false);
    this.filteredNames.push([]);
  }

  ngOnInit() {
    this.loadMedicines();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  loadMedicines() {
    this.medicineService.getAllMedicines().subscribe({
      next: (meds) => this.medicines = meds,
      error: (err) => console.error('Failed to load medicines:', err)
    });
  }

  onItemNameInput(index: number) {
    const value = this.items.at(index).get('itemName')?.value?.toLowerCase() || '';
    this.filteredNames[index] = this.medicines
      .map(med => med.name)
      .filter(name => name.toLowerCase().includes(value));
    this.showSuggestions[index] = this.filteredNames[index].length > 0;
  }

  onFocusItemName(index: number) {
    this.onItemNameInput(index); // Refresh suggestions
  }

  hideSuggestionsWithDelay(index: number) {
    setTimeout(() => {
      this.showSuggestions[index] = false;
    }, 200);
  }

  selectName(name: string, index: number) {
    this.items.at(index).get('itemName')?.setValue(name);
    const med = this.medicines.find(m => m.name === name);
    if (med) {
      this.items.at(index).get('itemPrice')?.setValue(med.price);
      // this.items.at(index).get('itemMfg')?.setValue(med.);
      this.items.at(index).get('itemPack')?.setValue(med.pack);
      this.items.at(index).get('itemBatch')?.setValue(med.batchNo);
      this.items.at(index).get('itemExpDate')?.setValue(med.expiryDate);
      this.calculateTotal(index);
    }
    this.showSuggestions[index] = false;
  }

  highlightMatch(name: string, index: number): string {
    const input = this.items.at(index).get('itemName')?.value || '';
    const regex = new RegExp(`(${input})`, 'i');
    return name.replace(regex, '<strong>$1</strong>');
  }

  createItem(orderNumber: number): FormGroup {
    return this.fb.group({
      orderNumber: [orderNumber],
      itemName: ['', Validators.required],
      itemQuantity: [1, [Validators.required, Validators.min(1)]],
      itemPrice: [0, [Validators.required, Validators.min(0)]],
      itemTotal: [{ value: 0, disabled: true }],
      itemMfg: [''],
      itemPack: [''],
      itemBatch: [''],  
      itemExpDate: ['']
    });
  }

  addItem(): void {
    const orderNumber = this.items.length + 1;
    this.items.push(this.createItem(orderNumber));

    // Add initial state for suggestions
    this.showSuggestions.push(false);
    this.filteredNames.push([]);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.showSuggestions.splice(index, 1);
    this.filteredNames.splice(index, 1);
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
      this._commonService.toastrService.error('Some of the fields are missing, please check and fill all the fields.', 'Error');

      return;
    }

    const formData = {
      ...this.invoiceForm.value,
      totalAmount: this.getTotalAmount()
    };
    this.generateBillHtml();
  }



  // generate Bill Html
  htmlContent: any;


  generateBillHtml() {
    let patientName = this.invoiceForm.get('patientName')?.value || '';
    let doctorName = this.invoiceForm.get('doctorName')?.value || '';
    let billNo = this.invoiceForm.get('billNo')?.value || '';
    let billDate = new Date().toLocaleDateString('en-GB');
    let itemsList: BillItemDto[] = this.invoiceForm.get('items')?.value || [];
    let netAmount = this.getTotalAmount();


    this.htmlContent = generateBillHtmlHelper.staticBoilerPlat(patientName.replace(' ', '_')) +
      generateBillHtmlHelper.generateBody(patientName, doctorName, billNo, billDate, itemsList,netAmount) +
      generateBillHtmlHelper.staticFooter();

    // Print the generated HTML content
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(this.htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      this._commonService.toastrService.error('Unable to open print window. Please allow pop-ups and try again.', 'Print Error');
    }
  }
}
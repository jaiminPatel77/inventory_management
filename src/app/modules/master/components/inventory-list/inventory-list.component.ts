import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medicine, MedicineReference } from '../../../shared/models/medicine_model-dto';
import { InventoryService } from '../../../shared/services/inventory.service';
import { debounceTime, switchMap, of, Subject, catchError, distinctUntilChanged, tap } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, NgbDatepickerModule],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss'
})
export class InventoryListComponent implements OnInit {
  displayExpiryDate = '';

  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  searchText = '';

  medicineForm?: FormGroup;
  showPopup = false;
  isEditMode = false;
  selectedMedicineId?: string;

  suggestedNames: string[] = [];
  filteredNames: MedicineReference[] = [];
  showSuggestions = false;

  constructor(private fb: FormBuilder, private medicineService: InventoryService) {
    this.createForm();
  }

  typeahead$ = new Subject<string>();
  isLoading = false;

  ngOnInit(): void {
    this.loadMedicines();
    this.typeahead$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.isLoading = true),
        switchMap(term =>
          this.medicineService.searchMedicineNames(term).pipe(
            catchError(() => of([])),
            tap(() => this.isLoading = false)
          )
        )
      )
      .subscribe(results => {
        this.filteredNames = results;
      });
  }

  createForm() {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      pack: ['', Validators.required],
      manufacturer: ['', Validators.required],
      batchNo: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      expiryDate: ['', Validators.required]
    });
  }

  loadMedicines() {
    this.medicineService.getAllMedicines().subscribe({
      next: (meds) => {
        this.medicines = meds;
        this.filteredMedicines = [...meds];
      },
      error: err => console.error('Failed to load medicines', err)
    });
  }

  filterMedicines() {
    const query = this.searchText.toLowerCase();
    this.filteredMedicines = this.medicines.filter(m => m.name.toLowerCase().includes(query));
  }

  openPopup() {
    this.medicineForm?.reset();
    this.isEditMode = false;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.isEditMode = false;
    this.selectedMedicineId = undefined;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(_: KeyboardEvent) {
    if (this.showPopup) this.closePopup();
  }

  addMedicine() {
    if (this.medicineForm?.valid) {
      const value = this.medicineForm.value;

      if (this.isEditMode && this.selectedMedicineId) {
        this.medicineService.updateMedicine(this.selectedMedicineId, value).subscribe(updated => {
          const index = this.medicines.findIndex(m => m.id === updated.id);
          if (index !== -1) this.medicines[index] = updated;
          this.filteredMedicines = [...this.medicines];
          this.closePopup();
        });
      } else {
        this.medicineService.createMedicine(value).subscribe(saved => {
          this.medicines.push(saved);
          this.filteredMedicines = [...this.medicines];
          this.closePopup();
        });
      }
    }
  }

  editMedicine(med: Medicine) {
    this.medicineForm?.patchValue(med);
    this.isEditMode = true;
    this.selectedMedicineId = med.id;
    this.showPopup = true;
  }

  deleteMedicine(id?: string) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this medicine?')) {
      this.medicineService.deleteMedicine(id).subscribe(() => {
        this.medicines = this.medicines.filter(m => m.id !== id);
        this.filteredMedicines = [...this.medicines];
      });
    }
  }

  onMedicineSelected(item: MedicineReference) {
    if (item) {
      this.medicineForm?.patchValue({
        pack: item.stripCount,
        manufacturer: item.companyName
      });
    }
  }


  getNgbDate(dateStr: string): NgbDateStruct | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  formatDate(struct: NgbDateStruct): string {
    if (!struct) return '';
    const { year, month, day } = struct;
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`; // ISO format
  }
  onExpiryDateSelected(date: NgbDateStruct) {
    if (!date) return;
    const isoDate = this.formatDate(date);
    this.medicineForm?.get('expiryDate')?.setValue(isoDate);
    this.displayExpiryDate = `${date.day.toString().padStart(2, '0')}-${date.month.toString().padStart(2, '0')}-${date.year}`;
  }


  highlightMatch(name: string): string {
    const input = this.medicineForm?.get('name')?.value || '';
    if (!input) return name;
    return name.replace(new RegExp(`(${input})`, 'gi'), '<strong>$1</strong>');
  }
}
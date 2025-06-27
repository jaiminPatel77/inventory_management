import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medicine } from '../../../shared/models/medicine_model-dto';
import { InventoryService } from '../../../shared/services/inventory.service';
import { debounceTime, switchMap, of } from 'rxjs';


@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss'
})
export class InventoryListComponent {
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  searchText = '';

  showPopup = false;
  medicineForm?: FormGroup;

  isEditMode = false;
  selectedMedicineId?: string;


  suggestedNames: string[] = [];
  filteredNames: string[] = [];
  showSuggestions = false;

  constructor(
    private fb: FormBuilder,
    private medicineService: InventoryService
  ) {
    this.createForm();
    this.loadMedicines();
  }
 ngOnInit(): void {
    this.medicineForm?.get('name')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((input: string) => {
          if (input && input.length > 1) {
            return this.medicineService.searchMedicineNames(input);
          }
          return of([]);
        })
      )
      .subscribe(results => {
        this.filteredNames = results.map(med => med.name);
        this.showSuggestions = results.length > 0;
      });
  }


  highlightMatch(name: string): string {
    const input = this.medicineForm?.get('name')?.value || '';
    if (!input) return name;
    const regex = new RegExp(`(${input})`, 'i');
    return name.replace(regex, '<strong>$1</strong>');
  }

  createForm() {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      pack: ['', Validators.required],
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
        this.filteredMedicines = [...this.medicines];
      },
      error: (err) => {
        console.error('Failed to load medicines:', err);
      }
    });
  }

  filterMedicines() {
    this.filteredMedicines = this.medicines.filter(med =>
      med.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  openPopup() {
    this.showPopup = true;
    this.medicineForm?.reset();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.showPopup) {
      this.closePopup();
    }
  }

  closePopup() {
    this.showPopup = false;
  }



  addMedicine() {
    if (this.medicineForm?.valid) {
      const formValue = this.medicineForm.value;

      if (this.isEditMode && this.selectedMedicineId) {
        // Update existing
        this.medicineService.updateMedicine(this.selectedMedicineId, formValue).subscribe(updated => {
          const index = this.medicines.findIndex(m => m.id === updated.id);
          if (index !== -1) this.medicines[index] = updated;
          this.filteredMedicines = [...this.medicines];
          this.resetForm();
        });
      } else {
        // Add new
        this.medicineService.createMedicine(formValue).subscribe(saved => {
          this.medicines.push(saved);
          this.filteredMedicines = [...this.medicines];
          this.resetForm();
        });
      }
    }
  }





  selectName(name: string) {
    this.medicineForm?.get('name')?.setValue(name);
    this.showSuggestions = false;
  }

  // Optional: Hide with slight delay to allow click
  hideSuggestionsWithDelay() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  editMedicine(med: Medicine) {
    this.isEditMode = true;
    this.selectedMedicineId = med.id;
    this.medicineForm?.patchValue(med);
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

  resetForm() {
    this.medicineForm?.reset();
    this.showPopup = false;
    this.isEditMode = false;
    this.selectedMedicineId = undefined;
  }



}

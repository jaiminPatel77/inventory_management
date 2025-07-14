import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalBillHistory, Medicine, MedicineReference } from '../models/medicine_model-dto';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getAllMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.baseUrl}/medicines`);
  }
  createMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(`${this.baseUrl}/medicines`, medicine);
  }

  getAllReferenceMedicines(): Observable<MedicineReference[]> {
    return this.http.get<MedicineReference[]>(`${this.baseUrl}/reference-upload`);
  }

  updateMedicine(id: string, medicine: Medicine): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.baseUrl}/medicines/${id}`, medicine);
  }

  deleteMedicine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/medicines/${id}`);
  }
  searchMedicineNames(query: string): Observable<MedicineReference[]> {
    return this.http.get<MedicineReference[]>(`${this.baseUrl}/reference-upload/search`, {
      params: { query }
    });
  }

  updateInventoryQuantities(items: { id: string, purchasedQuantity: number }[]): Observable<string> {
    return this.http.post(`${this.baseUrl}/medicines/bill`, items, { responseType: 'text' });
  }

  saveBill(bill: MedicalBillHistory): Observable<MedicalBillHistory> {
    return this.http.post<MedicalBillHistory>(`${this.baseUrl}/medicines/bills`, bill);
  }

  getAllBills(): Observable<MedicalBillHistory[]> {
  return this.http.get<MedicalBillHistory[]>(`${this.baseUrl}/medicines/bills`);
}



}

export interface Medicine {
  id?: string;
  name: string;
  pack: number;
  batchNo: string;
  quantity: number;
  price: number;
  expiryDate: string;
}

export interface MedicineReference {
  id?: string;
  name: string;
  companyName: string;
  stripCount: string;
}

export class  MedicalBillHistory {
  id?: string;
  patientName?: string;
  doctorName?: string;
  billDate?: string;
  items: Medicine[] = [];
  totalAmount?: number;
  htmlContent?: string;
}


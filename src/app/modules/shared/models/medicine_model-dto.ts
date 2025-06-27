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

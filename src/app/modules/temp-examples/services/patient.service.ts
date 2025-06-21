import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Observable } from 'rxjs';
import { EnumAllocationGroup, PatientDto, PatientLookUpDto } from '../models/patient-dto';
import { BaseLookUpDto } from '../../shared/models/base-model';

@Injectable({
  providedIn: 'root'
})
export class PatientService extends BaseService<PatientDto> {

  constructor() {
    super(BaseService.ApiUrls.Patient);
  }

  /**
   * get all records from server for entity lookup combo.
   */
  getLookUpList(): Observable<PatientLookUpDto[]> {
    return this.lookUpList<PatientLookUpDto>();
  }


  //#region fill static list starts

  getAllocationGroupLookupList(): BaseLookUpDto[] {
    let list: BaseLookUpDto[] = []
    list.push({ id: EnumAllocationGroup.Case, name: this._commonService.translateService.instant('Case') });
    list.push({ id: EnumAllocationGroup.Control, name: this._commonService.translateService.instant('Control') });
    return list;
  }

  //#region fill static list ends
}

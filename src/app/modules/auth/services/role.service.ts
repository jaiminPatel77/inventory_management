import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { RoleDto, RoleLookUpDto } from '../../admin/models/role-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService<RoleDto> {

  constructor() {
    super(BaseService.ApiUrls.Role);
  }

  /**
   * get all records from server for entity lookup combo.
   */
  getLookUpList(): Observable<RoleLookUpDto[]> {
    return this.lookUpList<RoleLookUpDto>();
  }
}

import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { TrialSiteDto, TrialSiteListDto, TrialSiteLookUpDto } from '../models/trial-site-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrialSiteService extends BaseService<TrialSiteDto> {

  constructor() {
    super(BaseService.ApiUrls.TrialSite);
  }

  getTrialSiteList():Observable<TrialSiteListDto[]> {
   return this.getList<TrialSiteListDto>();
  }

  /**
   * get all records from server for entity lookup combo.
   */
  getLookUpList(): Observable<TrialSiteLookUpDto[]> {
    return this.lookUpList<TrialSiteLookUpDto>();
  }
}

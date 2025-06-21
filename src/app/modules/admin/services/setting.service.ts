import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { SMTPSetting, SettingDto } from '../models/setting-dto';
import { Observable } from 'rxjs';
import { ApiOkResponse } from '../../shared/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class SettingService extends BaseService<SettingDto<any>> {
  constructor() {
    super(BaseService.ApiUrls.Setting);
  }

  //#region SMTP setting API

  /**
   * fetch SMTP setting from server.
   */
  getSMTPSetting(): Observable<ApiOkResponse<SettingDto<SMTPSetting>>> {
    const url = "/smpt-setting";
    return this.getResponse(this.baseUrl, url);
  }

  /**
   * update the SMTP setting
   * @param model model for SMTP setting
   */
  putSMTPSetting(model: SettingDto<SMTPSetting>): Observable<ApiOkResponse<SettingDto<SMTPSetting>>> {
    const url = "/smpt-setting";
    return this.putResponse(this.baseUrl, url, model);
  }

  //#endregion SMTP setting API


}
